/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';
import VueRouter from 'vue-router';
import router from './routes';

window.Vue = require('vue');

Vue.use(VueRouter)
// Vue.use(VueSocketIO, SocketInstance)

const app = new Vue({
    el: '#app',
    router
});
