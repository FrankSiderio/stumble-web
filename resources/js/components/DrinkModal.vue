<template>
  <div
    class="modal fade"
    id="drinkModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="drinkModalLabel"
    aria-hidden="true"
    data-backdrop="static"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="drinkModalLabel">Who Drank?</h4>
          <div class="col-8">
            <img
              v-bind:src="'/images/cards/' + this.latestCard.card.replace(/\s/g, '') + '.png'"
              style="width: 50px"
            />
            <h6>{{ this.latestCard.card }}</h6>
            <p>{{ this.latestCard.description }}</p>
          </div>
        </div>
        <div
          class="modal-body player d-flex justify-content-between"
          style="cursor: pointer"
          v-for="(player) in this.players"
          :key="player.id"
          v-on:click="drank(player)"
        >
          <p>{{ player.name }}</p>

          <strong v-bind:ref="player.id" hidden>Drank</strong>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            v-on:click.once="completeTurn"
          >Complete Turn</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DrinkModal",
  props: {
    players: Array,
    latestCard: Object
  },
  methods: {
    drank(player) {
      if (this.$refs[player.id][0].hidden) return this.addDrank(player)
        
      return this.removeDrank(player)
    },
    addDrank(player) {
      return axios
        .post(`${process.env.MIX_API}/match/drink`, {
          player: player.id,
          match: this.$route.params.identifier
        })
        .then(response => {
          if (response.status === 200) {
            this.$refs[player.id][0].hidden = false;
          }
        });
    },
    removeDrank(player) {
      return axios
        .delete(`${process.env.MIX_API}/match/drink`, {
          data: {
            player: player.id,
            match: this.$route.params.identifier
          }
        })
        .then(response => {
          if (response.status === 200) {
            this.$refs[player.id][0].hidden = true;
          }
        });
    },
    completeTurn() {
      this.$parent.onSubmitComplete();
    }
  }
};
</script>
<style scoped>
.player:hover {
  background-color: #3490dc;
  color: white;
}
</style>