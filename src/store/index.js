import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//* Game Files
import P5 from 'p5'
import Config from '@/game/Config.js'
//import GameState from '@/game/GameState.js'




const store = new Vuex.Store({
	// Only non-changing state values can be references by variable in imports (when config / gameState is overwritten, the variables will point to the old object)

	state: {
		p5: new P5(sketch => {}, 'canvasContainer'),
		config: new Config, //TODO: Load instead
		// gameState: null, //TODO: set on game start
		gameStatus: {
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
			state.gameStatus.players.push(player)
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

		addProjectile(state, projectile) {
			state.gameState.projectiles.push(projectile)
		},

		removePickup(state, index) {
			state.gameState.pickups.splice(index, 1)
		},

		deleteBulletTrail(state, bullet) {
			state.gameState.fx.bulletTrails.delete(bullet)
		},

		setStartedStatus(state, bool) {
			state.gameStatus.started = bool
		},

		setPauseStatus(state, bool) {
			state.gameStatus.paused = bool
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
		config: state => () => {
			return state.config
		},

		gameState: state => () => {
			return state.gameState
		},

		gameStatus: state => () => {
			return state.gameStatus
		},

	}
})

// store.state.gameState = new GameState

export default store