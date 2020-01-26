class Powerup {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}
}

class Ammo extends Powerup {
	constructor(owner, name) {
		super(owner, name)

		this.owner.ammo++
	}
}

const Powerup = {
	Ammo
}