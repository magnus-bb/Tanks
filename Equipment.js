//* BASES
class Equipment {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}

	_remove() {
		this.owner.equipment = null
	}
}

//TODO: Instause equipment to extend Equipment?

class Breaker extends Equipment {
	constructor(owner, name) {
		super(owner, name) 
	}

	use() {
		console.log(this.name + " used by: " + this.owner.name)

		state.projectiles.push(new BreakerBullet(this.owner))

		this._remove()
	}
}


//* OFFENSIVE

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
			this._remove()
		}
	}
}

class StealthBullets extends Equipment {
	constructor(owner, name) {
		super(owner, name)

		this.ammo = Config.current.equipment.stealthBullets.ammo
	}

	use() {
		console.log(this.name + " used by: " + this.owner.name)

		this.ammo--

		state.projectiles.push(new Bullet(this.owner, true)) // True for stealth

		if (this.ammo <= 0) {
			this._remove()
		}
	}
}


//* UTILITY

class Wormhole extends Equipment {
	constructor(owner, name) {
		super(owner, name)
		this.duration = Config.current.equipment.wormhole.chargeFrames
	}

	_autoUse() { //TODO: nyt navn? Cooldown etc. Skal evt sættes i instause parent
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

		otherTank && this._swap(otherTank) // Has to check for undefined since this can happen during end timer with just 1 tank (random returns undefined)

		this._remove()
	}

	// Swaps x, y, and direction with other tank:
	_swap(otherTank) {
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
		this._autoUse()
	}
}

class Ammo extends Equipment {
	constructor(owner) {
		super(owner)
	}

	instaUse() {
		this.owner.ammo++

		this._remove()
	}
}



//* Dictionary
const equipment = {
	Wormhole,
	M82,
	Breaker,
	Ammo,
	StealthBullets
}