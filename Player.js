class Player {
	constructor(id, name, colorArray, controls) {
		this.id = id // Index num in Game.players
		this.name = name
		this.color = colorArray
		this.controls = controls
		this.wins = 0
		this.deaths = 0
		this.kills = 0
	}

	gotKill(tank) {
		// Suicide:
		if (tank.owner === this) {
			this.suicides++
		} else {
			this.kills++
		}
	}

	died() {
		this.deaths++
	}
}