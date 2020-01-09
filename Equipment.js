//* BASES
class Equipment {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}

	remove() {
		this.owner.equipment = null
	}
}


//* OFFENSIVE

class Placeholder extends Equipment {
	constructor(owner, name) {
		super(owner, name)
	}

	use() {
		console.log(this.name + " used by: " + this.owner.name)


		// Last step:
		this.remove()
	}
}

class M82 extends Equipment {
	constructor(owner, name) {
		super(owner, name)

		this.ammo = Config.current.equipment.m82.ammo
	}

	use() {
		console.log(this.name + " used by: " + this.owner.name)

		this.ammo--

		// Putting self-sufficient bullet in state with the same owner as this equip:
		state.projectiles.push(new M82Bullet(this.owner))

		// Last step:
		if (this.ammo <= 0) {
			this.remove()
		}
	}
}


//* INSTAUSE

class Wormhole extends Equipment {
	constructor(owner, name) {
		super(owner, name)
		this.duration = Config.current.equipment.wormhole.chargeFrames
	}

	autoUse() { //TODO: nyt navn? Cooldown etc. Skal evt sættes i instause parent
		if (this.duration <= 0) {
			this._use()
		}

		this.duration--
	}

	// Private to not make tank be able to use():
	_use() { 
		console.log(this.name + " used by: " + this.owner.name)

		const selfIndex = state.tanks.findIndex(i => i.equipment === this)
		const otherTank = randomTank(selfIndex)

		otherTank && this.swap(otherTank) // Has to check for undefined since this can happen during end timer with just 1 tank (random returns undefined)

		this.remove()
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
	Wormhole,
	M82
}