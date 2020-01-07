//* OFFENSIVE

class Placeholder {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}

	use() {
		console.log(this.name + " used by: " + this.owner.name)


		// Last step:
		this.owner.equipment = null
	}
}


//* INSTA

class Wormhole {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
		this.duration = config.equipment.wormholeChargeTime
	}

	autoUse() {
		if (this.duration <= 0) {
			this._use()
		}

		this.duration--
	}

	_use() { // Private to not make tank be able to use()
		console.log(this.name + " used by: " + this.owner.name)

		const selfIndex = state.tanks.findIndex(i => i.equipment === this)
		const otherTank = randomTank(selfIndex)

		otherTank && this.swap(otherTank) // Has to check for undefined since this can happen during end timer with just 1 tank (random returns undefined)

		this.owner.equipment = null
	}

	// Swaps x, y, and direction with other tank:
	swap(otherTank) {
		const temp = {
			x: this.owner.x,
			y: this.owner.y,
			direction: this.owner.direction
		}

		this.owner.x = otherTank.x
		this.owner.y = otherTank.y
		this.owner.direction = otherTank.direction

		otherTank.x = temp.x
		otherTank.y = temp.y
		otherTank.direction = temp.direction
	}

	onFrame() {
		this.autoUse()
	}
}

const equipment = {
	Placeholder,
	Wormhole
}