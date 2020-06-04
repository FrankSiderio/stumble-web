<template>
  <div class="card mt-4">
    <div class="card-header">Join a Game</div>

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
    </div>
  </div>
</template>

<script>
import router from "../routes";

export default {
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
            this.error = `Game not found with code - ${this.match}`
            this.match = ''
          } else {
            this.error = 'Something went wrong :('
          }
        });
    }
  }
};
</script>