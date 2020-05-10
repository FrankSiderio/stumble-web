<template>
  <div
    class="modal fade"
    id="drinkModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="drinkModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="drinkModalLabel">Who Drank?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          class="modal-body player d-flex justify-content-between"
          style="cursor: pointer"
          v-for="(player) in this.players"
          :key="player.id"
          v-on:click.once="drank(player)"
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
          >Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DrinkModal",
  props: {
    players: Array
  },
  methods: {
    drank(player) {
      this.$refs[player.id][0].hidden = false;

      return axios
        .post(`${process.env.MIX_API}/match/drink`, {
          player: player.id,
          match: this.$route.params.identifier
        })
        .then(response => {
          console.log(response);
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
  background-color: #6c757d;
}
</style>