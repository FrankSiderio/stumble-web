<template>
    <div class="card">
        <div class="card-header">Join or Create</div>

        <div class="card-body">
            <form @submit.prevent="joinMatch">
                <input type="text" id="match" name="match" v-model="match" />

                <button class="" type="submit">Join</button>
            </form>

            <form @submit.prevent="createMatch">
                <!-- <input type="text" id="match" name="match" v-model="match" /> -->
                <select class="form-control" name="people" v-model="selectedGame">
                    <option v-for="game in this.games" :key="game.id" v-bind:value="game.id">{{ game.name }}</option>
                </select>
                <button class="" type="submit">Create</button>
            </form>
        </div>
    </div>
</template>

<script>
import router from '../routes';

export default {
    mounted() {
        console.log()
        axios.get(`${process.env.MIX_API}/games`).then(response => {
            if (response.status == 200) {
                this.games = response.data
            }
        })
    },

    data() {
        return {
            match: '',
            selectedGame: '',
            games: []
        }
    },

    methods: {
        joinMatch() {
            axios.post(`${process.env.MIX_API}/match/join`, { player: JSON.parse(localStorage.player).id, match: this.match }).then(response => {
                console.log(response.data)

                if (response.status == 200) {
                    router.push(`/match/${this.match}`)
                }

                // TODO: Add error message if we can't find match
            })
        },

        createMatch() {
            axios.post(`${process.env.MIX_API}/match`, { game: this.selectedGame, owner: JSON.parse(localStorage.player).id }).then(response => {
                console.log(response.data.match.identifier)
                if (response.status == 200) {
                    router.push(`/match/${response.data.match.identifier}`)
                }
            })
        }
    }

}
</script>