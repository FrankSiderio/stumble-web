<template>
  <div class="card">
    <div class="card-header">Player</div>

    <div class="card-body">
        {{ this.player.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player: JSON.parse(localStorage.player)
    };
  }
};
</script>
