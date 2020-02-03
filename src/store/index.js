import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//* Game Files
import P5 from 'p5'
import Config from '@/game/Config.js'
//import GameState from '@/game/GameState.js'




const store = new Vuex.Store({

	state: {
		p5: new P5(sketch => { }, 'canvasContainer'),
		config: new Config, //TODO: Load instead
		// gameState: null, //TODO: set on game start
		game: {
			// For menu manipulation, not state/round management:
			started: false,
			paused: true,
			players: [] //? evt et map til at holde styr på tanks?
		},
		// setup: {
		// // 	TODO: Static props from classes here
		// 	cellStack: [] //TODO: Move out of vuex?
		// },
		// assets: { //TODO: Move out of vuex?
		// 	pickups: {},
		// 	projectiles: {},
		// 	stealthProjectiles: {},
		// 	//fx: {}
		// }
	},
	mutations: {
		addPlayer(state, payload) {
			state.game.players.push(payload)
		},
		setupSketch(state, payload) {
			state.p5.preload = payload.preload
			state.p5.setup = payload.setup
			state.p5.draw = payload.draw
		},
		setConfig(state, payload) {
			state.config = payload
		},
		// changeGame(state, payload) {
		// 	state.game[payload.key] = payload.value
		// }
		// setPickupAsset(state, payload) {
		// 	state.assets.pickups[payload.name] = payload.asset
		// },
		setGameState(state, payload) {
			state.gameState = payload
		},
		addGridColumn(state, payload) {
			state.gameState.grid.push(payload)
		},
		// test(state) {
		// 	state.config.fps -= 10
		// }
	},
	actions: {

	},
	getters: {
		
	}
})

// store.state.gameState = new GameState

export default store