<template>
  <div>
    <h1>{{ this.match.drinkingGame.name }}</h1>

    <h3>Players</h3>
    <p v-for="(player, index) in this.match.players" :key="player.id" v-bind:class="{ 'text-danger': index == match.turnIndex }"> {{ player.name }}</p>
  
    <form v-if="myTurn && match.identifier.length > 0" @submit.prevent="onSubmit">
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
var socket

export default {
  mounted() {
    this.fetchData().then(() => {
      const socketConnection = () => {
        return socketio(process.env.MIX_API, {
          query: 'match='+this.match.identifier
        });
      }

      socket = socketConnection(this.match.identifier)

      socket.on('dealt a card', (response) => {
        console.log('dealt a card bob!')
        // The response from this is the same as the initial call
        this.match = response
        this.setMyTurn()
      });

      socket.on('player joined', (response) => {
        this.fetchData()
      })
    })
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
      if (this.match.identifier) { // Only want to do this if identifier is set
        socket.emit('dealt a card', this.match.identifier)
      }
    },
    setMyTurn() {
      this.myTurn = this.match.players[this.match.turnIndex].id == JSON.parse(localStorage.player).id
    },

    fetchData() {
      return axios.get(`${process.env.MIX_API}/match/${this.$route.params.identifier}`).then(response => {
        this.match = response.data
        this.setMyTurn()
      })
    }
  }
}
</script>
