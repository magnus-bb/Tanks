import store from '@/store'
const { config } = store.getters

export default class GameState {
	constructor() {
		this.grid = []
		this.tanks = []
		this.projectiles = []
		this.pickups = []
		this.endTimer = config().game.endFrames
		this.ending = false
		this.fx = {
			bulletTrails: new Map(),
			// particles: {
			// 	on: false,
			// 	array: []
			// }
		}
	}
}