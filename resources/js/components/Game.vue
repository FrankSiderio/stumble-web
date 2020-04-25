<template>
  <div class="align-items-center d-flex flex-column">
    <h2>Playing - {{ this.match.drinkingGame.name }}</h2>
    <p>Game Code - {{ this.match.identifier }}</p>
    <div class="d-flex">
      <div class="card mx-4" style="height: fit-content">
        <div class="card-header">Players</div>

        <div class="card-body">
          <p
            v-for="(player, index) in this.match.players"
            :key="player.id"
            v-bind:class="{ 'text-danger': index == match.turnIndex }"
          >{{ getPlayerName(player) }}</p>
        </div>
      </div>
      <div class="d-flex" style="width: min-content">
        <div>
          <img src="../../../public/images/cards/blue_back.png" style="width: 250px" />

          <form class="mt-2" v-if="myTurn && !dealtACard" @submit.prevent.once="onSubmitTurn">
            <button class="btn btn-primary" type="submit">Deal a card!</button>
          </form>
          <form class="mt-2" v-if="dealtACard" @submit.prevent="onSubmitComplete">
            <button class="btn btn-primary" type="submit">Complete turn</button>
          </form>        
        </div>

        <div class="mx-2" v-if="match.latestCard">
          <img
            v-bind:src="'/images/cards/' + match.latestCard.card.replace(/\s/g, '') + '.png'"
            style="width: 250px"
          />
          <p>{{ this.match.latestCard.card }}</p>
          <p>{{ this.match.latestCard.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socketio from "socket.io-client";
var socket;

export default {
    mounted() {
        this.fetchData().then(() => {
            const socketConnection = () => {
                return socketio(process.env.MIX_API, {
                    query: "match=" + this.match.identifier
                })
            }

            socket = socketConnection(this.match.identifier);

            socket.on("dealt a card", response => {
                // The response from this is the same as the initial call
                this.match = response
            })

            socket.on("completed a turn", response => {
                // console.log('completed turn')
                // console.log(response)
                this.match = response
                this.setMyTurn()
            })

            socket.on("player joined", response => {
                this.fetchData()
            })

            socket.on("player left", response => {
                this.fetchData()
            })
        })
    },

    data() {
        return {
            dealtACard: false,
            myTurn: false,
            match: {
                turnIndex: "",
                drinkingGame: { name: '' },
                identifier: "",
                players: [],
                latestCard: {
                    description: "",
                    card: ""
                }
            }
        };
    },

    methods: {
        onSubmitTurn() {
            if (this.match.identifier) {
                socket.emit("dealt a card", this.match.identifier)
                this.dealtACard = true
            }
        },
        onSubmitComplete() {
            if (this.match.identifier) {
                socket.emit("completed a turn", this.match.identifier)
                this.dealtACard = false
            }
        },
        setMyTurn() {
            console.log(this.match.turnIndex)
            this.myTurn =
                this.match.players[this.match.turnIndex].id ==
                JSON.parse(localStorage.player).id;
        },
        fetchData() {
            return axios
                .get(`${process.env.MIX_API}/match/${this.$route.params.identifier}`)
                .then(response => {
                this.match = response.data;
                this.setMyTurn();
                });
        },
        getPlayerName(player) {
            return `${player.name} ${(JSON.parse(localStorage.player).id === player.id ? ' (Me)' : '')}`
        }
    }
};
</script>
