class Player {
	constructor(id, name, color, controls) {
		this.id = id // Index num in Game.players
		this.name = name
		this.color = color
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

		Status.update(this.id)
	}

	died() {
		this.deaths++

		status.update(this.id)
	}
}