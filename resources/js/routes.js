import VueRouter from 'vue-router';
import Home from './components/Home.vue';
import Game from './components/Game.vue'

let routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/match/:identifier',
    component: Game
  }
]

export default new VueRouter({
  routes
});