import GameState from './GameState.js'
import Tank from './Tank.js'
import grid from './grid.js'
import { randomSpawnCoords, pointCloseToTank } from './helpers.js'

import store from '@/store'
const { p5 } = store.state
const { gameState, gameStatus } = store.getters

const game = {
	addPlayer(player) {
		if (gameStatus().started) return console.log("Game has already started")

		store.commit('addPlayer', player)

		// Uses index to ID the status-DIV:
		//const index = store.state.game.players.length - 1

		// Shows div in status bar:
		// Status.initPlayer(player, index) 
	},

	new() {
		// Cannot start twice or if there are no players:
		if (gameStatus().started || gameStatus().players.length <= 0) return console.log("Cannot start game")

		// $('#startMenu').fadeOut(100)
		store.commit('setGameState', new GameState)
		this.start()
	},

	start() { // Uses arrow func to use 'this'
		console.log('Game started')

		// Wipes all cells and remakes them:
		grid.generate()
		// Sets random walls:
		grid.populateWalls()
		// Removes specific walls to make sure every part is traversible:
		grid.generateMaze()

		// Adds players' tanks:
		for (const player of gameStatus().players) {

			let spawnCoords = randomSpawnCoords()

			// Makes new point if prior was too close to a tank:
			while (pointCloseToTank(spawnCoords)) {
				spawnCoords = randomSpawnCoords()
			}

			store.commit('addTank', new Tank(player.name, player.color, spawnCoords.x, spawnCoords.y, player.controls, player))
		}

		// game.started = true
		store.commit('setStartedStatus', true)

		//$('#nextRoundMenu').fadeOut(100)
		// Hides menu:
		this.unpause()
	},

	// Checks if game should start counting towards ending:
	tankDestroyed() {
		if (gameState().tanks.length <= 1) {
			store.commit('gameEnding')
		}
	},

	end() { //TODO: Handle winner by checking who is left (if (state.tanks[0]) state.tanks[0].owner.wins++?)
		console.log('Game ended')

		// game.started = false
		store.commit('setStartedStatus', false)

		//$('#nextRoundMenu').fadeIn(100)
		this.pause()

		// Resets all ingame state:
		//state = new GameState
	},

	pause() {
		console.log('Game paused')

		// game.paused = true
		store.commit('setPauseStatus', true)
		p5.noLoop()

		//$('#gameMenu').slideDown()
	},

	unpause() {
		console.log('Game unpaused')

		// Restarts when menu is gone:
		//$('#gameMenu').slideUp(() => {
		// game.paused = false
		store.commit('setPauseStatus', false)
		p5.loop()
		//	})
	},

	// Called once every frame:
	onFrame() {
		if (gameState().ending) {
			// Begins counting down for end:
			store.commit('endTimer')
		}

		// Checks if game should end:
		if (gameState().endTimer <= 0) {
			this.end()
		}
	}
}

export default game