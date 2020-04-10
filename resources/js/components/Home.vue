<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card" v-if="!isHidden">
                    <div class="card-header">Create a Player</div>

                    <div class="card-body">
                        <form @submit.prevent="onSubmit">
                            <input type="text" id="name" name="name" v-model="name">

                        </form>
                    </div>
                </div>

                <Create v-if="isHidden" />
            </div>
        </div>
    </div>
</template>

<script>
    import Create from '../components/Create.vue';

    export default {
        components: { Create },

        data() {
            return {
                name: '',
                isHidden: (localStorage.player) ? true : false
            }
        },

        mounted() {
            console.log('Component mounted.')
        },

        methods: {
            onSubmit() {
                axios.post(`${process.env.MIX_API}/player`, { name: this.name }).then(response => {
                    if (response.status == 200) {
                        localStorage.player = JSON.stringify(response.data.player)
                        this.isHidden = true
                    }
                }).catch(error => console.log(error))
            }
        }
    }
</script>
