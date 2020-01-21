class Modifier {
	constructor(owner, name) {
		this.owner = owner
		this.name = name
	}
}

class StealthBullets extends Modifier {
	constructor(owner, name) {
		super(owner, name)

		this.duration = Config.current.modifiers.stealthBullets.duration
	}

	use() {
		//!console.log(this.name + " used by: " + this.owner.name)
//!
		//!this.ammo--
//!
		//!state.projectiles.push(new Bullet(this.owner, true)) // True for stealth
//!
		//!if (this.ammo <= 0) {
		//!	this._remove()
		//!}
	}
}

//* Dictionary
const modifier = {
	StealthBullets
}