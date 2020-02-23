import P5 from 'p5'
import Config from '@/game/Config.js'

export const state = {
	p5: new P5(sketch => {}, 'canvasContainer'),
	config: new Config, //TODO: Load instead
	gameState: {}, // gameState is set on game start
	gameStatus: {
		// For menu manipulation, not ingame management:
		paused: true,
		started: false,
		created: false,
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
}