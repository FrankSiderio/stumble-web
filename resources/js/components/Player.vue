<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between">
      <strong>Player</strong>
      <img
        v-on:click="handleClick"
        src="../../../public/images/icons/pencil.png"
        style="width: 20px; height: 20px; cursor: pointer"
      />
    </div>

    <div class="card-body">
      <form class="d-flex" v-if="canEditName" @submit.prevent.once="onSubmit">
        <input class="form-control" type="text" name="name" v-model="player.name" />
        <button class="btn btn-primary ml-2">Update</button>
      </form>

      <p class="m-0" v-if="!canEditName">{{ this.player.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player: JSON.parse(localStorage.player),
      canEditName: false
    };
  },
  methods: {
    handleClick() {
      this.canEditName = !this.canEditName
    },
    onSubmit() {
      axios
        .put(`${process.env.MIX_API}/player`, { currentName: JSON.parse(localStorage.player).name, newName: this.player.name, id: this.player.id })
        .then(response => {
          if (response.status == 200) {
            localStorage.player = JSON.stringify(response.data.player)
            this.canEditName = false
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
