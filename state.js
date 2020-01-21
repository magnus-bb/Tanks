class GameState {
	constructor() {
		this.grid = []
		this.tanks = []
		this.projectiles = []
		this.pickups = []
		this.endTimer = config.game.endFrames
		this.ending = false
		this.fx = {
			bulletTrails: new Map()
		}
	}
}

// Makes first state-object ready:
let state = new GameState