class GameState {
	constructor() {
		this.tanks = []
		this.projectiles = {
			bullets: [],
			trails: new Map()
		}
		this.grid = []
	}
}

// Makes first state-object ready:
let state = new GameState