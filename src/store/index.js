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
		setup: {
		// 	TODO: Static props from classes here
			cellStack: []
		},
		assets: { //TODO: Move out of vuex?
			pickups: {},
			projectiles: {},
			stealthProjectiles: {},
			//fx: {}
		}
	},
	mutations: {
		addPlayer(state, player) {
			state.game.players.push(player)
		},

		setupSketch(state, payload) {
			state.p5.preload = payload.preload
			state.p5.setup = payload.setup
			state.p5.draw = payload.draw
		},

		setConfig(state, config) {
			state.config = config
		},

		pushSetupCell(state, cell) {
			state.setup.cellStack.push(cell)
		},

		popSetupCell(state) {
			state.setup.cellStack.pop()
		},

		addPickup(state, pickup) {
			state.gameState.pickups.push(pickup)
		},

		removePickup(state, index) {
			state.gameState.pickups.splice(index, 1)
		},

		deleteBulletTrail(state, bullet) {
			state.gameState.fx.bulletTrails.delete(bullet)
		},

		setStartedStatus(state, bool) {
			state.game.started = bool
		},

		setPauseStatus(state, bool) {
			state.game.paused = bool
		},

		setPickupAsset(state, payload) {
			state.assets.pickups[payload.name] = payload.asset
		},

		setGameState(state, gameState) {
			state.gameState = gameState
		},

		addGridColumn(state, col) {
			state.gameState.grid.push(col)
		},

		addTank(state, tank) {
			state.gameState.tanks.push(tank)
		},

		gameEnding(state) {
			state.gameState.ending = true
		},

		endTimer(state) {
			state.gameState.endTimer--
		}

	},

	actions: {

	},

	getters: {
		
	}
})

// store.state.gameState = new GameState

export default store