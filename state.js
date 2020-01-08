class GameState {
	constructor() {
		this.grid = []
		this.tanks = []
		this.projectiles = []
		this.bulletTrails = new Map()
		this.pickups = []
		this.endTimer = config.game.endFrames
		this.ending = false
	}
}

// Makes first state-object ready:
let state = new GameState