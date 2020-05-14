<template>
  <div class="align-items-center d-flex flex-column">
    <h2>Playing - {{ this.match.drinkingGame.name }}</h2>
    <p>Game Code - {{ this.match.identifier }}</p>
    <div class="d-flex">
      <div class="card mx-4" style="height: fit-content">
        <div class="card-header d-flex">
          <strong>Players</strong>
          <form class="ml-5" @submit.prevent="onLeave">
            <button class="btn btn-danger">Leave Game</button>
          </form>
        </div>
        <div class="card-body">
          <div
            class="d-flex justify-content-between"
            v-for="(player, index) in this.match.players"
            :key="player.id"
            v-bind:class="{ 'text-danger': index == match.turnIndex }"
          >
            <p>{{ getPlayerName(player) }}</p>
            <p>{{ getDrinkAmount(player) }} Dranks</p>
          </div>
        </div>
      </div>
      <div class="d-flex" style="width: min-content">
        <div>
          <img src="../../../public/images/cards/blue_back.png" style="width: 250px" />

          <form class="mt-2" v-if="myTurn && !dealtACard" @submit.prevent.once="onSubmitTurn">
            <button class="btn btn-primary" type="submit" data-toggle="modal" data-target="#drinkModal">Deal a card!</button>
          </form>
          <drink-modal v-bind:players="match.players" v-bind:latestCard="match.latestCard" :key="modalKey"></drink-modal>
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
import router from "../routes";
import socketio from "socket.io-client";
import DrinkModal from "../components/DrinkModal.vue";
var socket;

export default {
  components: { DrinkModal },

  mounted() {
    this.fetchData().then(() => {
      const socketConnection = () => {
        return socketio(process.env.MIX_API, {
          query: "match=" + this.match.identifier
        });
      };

      socket = socketConnection(this.match.identifier);

      socket.on("dealt a card", response => {
        // The response from this is the same as the initial call
        this.match = response;
      });

      socket.on("completed a turn", response => {
        this.match = response;
        this.setMyTurn();
      });

      socket.on("player joined", response => {
        this.fetchData();
      });

      socket.on("player left", response => {
        this.fetchData();
      });
    });
  },

  data() {
    return {
      modalKey: 0,
      dealtACard: false,
      myTurn: false,
      match: {
        turnIndex: "",
        drinkingGame: { name: "" },
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
        this.dealtACard = true;
        socket.emit("dealt a card", this.match.identifier);
      }
    },
    onSubmitComplete() {
      if (this.match.identifier) {
        socket.emit("completed a turn", this.match.identifier);
        this.dealtACard = false;
        this.modalKey++ // Remounting component so we can reset who drank for the next turn
      }
    },
    onLeave() {
      socket.emit("player left", {
        match: this.match.identifier,
        player: JSON.parse(localStorage.player)
      });
      router.push("/");
    },
    setMyTurn() {
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
      return `${player.name} ${
        JSON.parse(localStorage.player).id === player.id ? " (Me)" : ""
      }`;
    },
    getDrinkAmount(player) {
      const drinks = this.match.drinks.filter(
        drink => drink.player_id === player.pivot.player_id
      );

      if (drinks.length === 0) return 0;

      return drinks[0].amount;
    }
  }
};
</script>
