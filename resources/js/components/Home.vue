<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card" v-if="!isHidden">
          <div class="card-header">Create a Player</div>

          <div class="card-body">
            <form @submit.prevent="onSubmit">
              <input
                class="form-control"
                type="text"
                id="name"
                name="name"
                v-model="name"
                placeholder="Player Name"
              />

              <button class="btn btn-primary mt-4" type="submit">Create</button>
            </form>
          </div>
        </div>
        <div v-if="isHidden">
          <Player />

          <div class="d-flex justify-content-between">
            <Join />
            <Create v-bind:games="this.games" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Create from "../components/Create.vue";
import Join from "../components/Join.vue";
import Player from "../components/Player.vue";

export default {
  components: { Create, Player, Join },

  data() {
    return {
      name: "",
      isHidden: localStorage.player ? true : false,
      match: "",
      selectedGame: "",
      games: [],
      error: undefined
    }
  },

  mounted() {
    axios.get(`${process.env.MIX_API}/games`).then(response => {
      if (response.status == 200) {
        this.games = response.data;
      }
    })
  },

  methods: {
    onSubmit() {
      axios
        .post(`${process.env.MIX_API}/player`, { name: this.name })
        .then(response => {
          if (response.status == 200) {
            localStorage.player = JSON.stringify(response.data.player)
            this.isHidden = true
          }
        })
        .catch(error => console.log(error))
    }
  }
};
</script>
