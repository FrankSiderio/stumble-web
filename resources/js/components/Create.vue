<template>
  <div class="card mt-4">
    <div class="card-header">Join a Game or Create Your Own!</div>

    <div class="card-body">
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ this.error }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="d-flex" @submit.prevent="joinMatch">
        <input
          class="form-control mr-4"
          type="text"
          id="match"
          name="match"
          v-model="match"
          placeholder="Game Code"
        />

        <button class="btn btn-primary" type="submit">Join</button>
      </form>

      <form class="d-flex mt-4" @submit.prevent="createMatch">
        <select class="form-control mr-4" name="people" v-model="selectedGame">
          <option disabled selected value>-- select a game --</option>
          <option v-for="game in this.games" :key="game.id" v-bind:value="game.id">{{ game.name }}</option>
        </select>
        <button class="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import router from "../routes";

export default {
  mounted() {
    axios.get(`${process.env.MIX_API}/games`).then(response => {
      if (response.status == 200) {
        this.games = response.data;
      }
    });
  },

  data() {
    return {
      match: "",
      selectedGame: "",
      games: [],
      error: undefined
    };
  },

  methods: {
    joinMatch() {
      axios
        .post(`${process.env.MIX_API}/match/join`, {
          player: JSON.parse(localStorage.player).id,
          match: this.match
        })
        .then(response => {
          if (response.status == 200) {
            router.push(`/match/${this.match}`);
          }
        })
        .catch(error => {
          if (error.response.status == 404) {
            this.error = `Can\'t find any game with the code - ${this.match}`
            this.match = ''
          } else {
            this.error = 'Something went wrong :('
          }
        });
    },

    createMatch() {
      axios
        .post(`${process.env.MIX_API}/match`, {
          game: this.selectedGame,
          owner: JSON.parse(localStorage.player).id
        })
        .then(response => {
          if (response.status == 200) {
            router.push(`/match/${response.data.match.identifier}`);
          }
        });
    }
  }
};
</script>