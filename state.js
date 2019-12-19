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

let state = new GameState