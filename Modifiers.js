class Modifier {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}
}

class StealthAmmo extends Modifier {
	constructor(owner, name) {
		super(owner, name)

		this.duration = config.modifier.stealthAmmo.duration
	}

	onFrame() {
		if (!this.owner.stealthedAmmo) {
			this.owner.stealthedAmmo = true
		}

		this.duration--

		if (this.duration <= 0) {
			this._remove()
		}
	}

	_remove() {
		this.owner.stealthedAmmo = false
		this.owner.modifiers.delete(this)
	}
}

//* Dictionary
const Modifier = {
	StealthAmmo
}