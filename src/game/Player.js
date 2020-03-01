import store from '@/store'

export default class Player {
	constructor(name, colorArray, controls) {
		this.id = store.state.gameStatus.players.length //! Players might not need unique ID, now that we can keep track of them with vue
		this.tank = null // Gets set in Tank constructor (every round)
		this.name = name
		this.color = colorArray
		this.controls = controls
		this.wins = 0
		this.deaths = 0
		this.kills = 0
		this.suicides = 0
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