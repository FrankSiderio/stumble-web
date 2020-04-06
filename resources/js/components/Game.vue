<template>
  <div>
    <h1>{{ this.match.drinkingGame.name }}</h1>

    <h3>Players</h3>
    <p v-for="(player, index) in this.match.players" :key="player.id" v-bind:class="{ 'text-danger': index == match.turnIndex }"> {{ player.name }}</p>
  
    <form v-if="myTurn" @submit.prevent="onSubmit">
      <button type="submit">Deal a card!</button>
    </form>

    <div v-if="match.latestCard">
      <h2>Latest Dealt Card</h2>
      <p>{{ this.match.latestCard.card }}</p>
      <p>{{ this.match.latestCard.description }}</p>
    </div>
  </div>
</template>

<script>
import socketio from 'socket.io-client';
const socket = socketio('http://127.0.0.1:3333')

export default {
  mounted() {
    axios.get(`http://127.0.0.1:3333/match/${this.$route.params.identifier}`).then(response => {
      this.match = response.data
      this.setMyTurn()
    })

    socket.on('dealt a card', (response) => {
      console.log('dealt a card bob!')
      // The response from this is the same as the initial call
      this.match = response
      this.setMyTurn()
    });
  },

  data() {
    return {
      myTurn: false,
      match: {
        turnIndex: '',
        drinkingGame: {},
        identifier: '',
        players: [],
        latestCard: {
          description: '',
          card: ''
        }
      }
    }
  },

  methods: {
    onSubmit() {
      socket.emit('dealt a card', this.match.identifier)
    },
    setMyTurn() {
      this.myTurn = this.match.players[this.match.turnIndex].id == JSON.parse(localStorage.player).id
    }
  }
}
</script>
