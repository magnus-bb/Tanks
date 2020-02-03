import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import store from './store'

Vue.config.productionTip = false

Vue.use(Vuex)

new Vue({
	el: "#app",
	store,
	render: function (h) { return h(App) },
})
