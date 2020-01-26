//* BREAKER

function Breaker(owner, name) {
	const props = {
		owner,
		name
	}
	return {
		...props,
		...canRemoveSelf(),

		use() {
			console.log(this.name + " used by: " + this.owner.name)

			state.projectiles.push(new BreakerBullet(this.owner))

			this._remove()
		}
	}
}


//* M82

function M82(owner, name) {
	const props = {
		owner,
		name
	}

	return {
		...props,
		...Equipment.mixins.canRemoveSelf(),
		...Equipment.mixins.hasAmmo(name),

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

}


//* WORMHOLE

function Wormhole(owner, name) {
	const props = {
		owner,
		name
	}

	return {
		...props,
		...Equipment.mixins.hasChargeTime(props.name),
		...Equipment.mixins.canRemoveSelf(),

		// No use() on chargeTimer equipment:
		_autoUse() {
			console.log(this.name + " used by: " + this.owner.name)

			const selfIndex = state.tanks.findIndex(i => i.equipment === this)
			const otherTank = randomTank(selfIndex)

			otherTank && this._swap(otherTank) // Has to check for undefined since this can happen during end timer with just 1 tank (random returns undefined)

			this._remove()
		},

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
	}
}


//* LOOKUP DICTIONARY

// For generically looking up constructor from a string:
const Equipment = {
	Wormhole,
	M82,
	Breaker,


	//* COMPOSITIONAL MIXINS

	mixins: {
		hasAmmo(name) {
			return {
				ammo: config.equipment[name].ammo
			}
		},

		hasChargeTime(name) {
			return {
				chargeTime: config.equipment[name].chargeFrames,

				_timer() { //TODO: Timed equipment might be common. If so - move to mixin (and maybe with onFrame()), and leave autoUse up to the class
					if (this.chargeTime <= 0) {
						this._autoUse()
					}

					this.chargeTime--
				},

				onFrame() {
					this._timer()
				}
			}
		},

		canRemoveSelf() {
			return {
				_remove() {
					this.owner.equipment = null
				}
			}
		}
	}
}