/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';
import VueRouter from 'vue-router';
import router from './routes';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

// export const SocketInstance = socketio('http://127.0.0.1:3333');


window.Vue = require('vue');

Vue.use(VueRouter)
// Vue.use(VueSocketIO, SocketInstance)

const app = new Vue({
    el: '#app',
    router
});
