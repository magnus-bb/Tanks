class GameState {
	constructor() {
		this.grid = []
		this.tanks = []
		this.projectiles = {
			bullets: [],
			trails: new Map()
		}
		this.pickups = []
		this.endTimer = config.game.endFrames
	}
}

// Makes first state-object ready:
let state = new GameState