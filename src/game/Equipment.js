import * as projectile from './Projectiles.js'
import { LaserSight } from './Modifiers.js'

import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters

//* BREAKER

function Breaker(owner, name) {
	mixins.canHaveLaserSight(owner, name) // Off by default

	const props = {
		owner,
		name
	}

	return {
		...props,
		...mixins.canRemoveSelf(),

		use() {
			console.log(this.name + " used by: " + this.owner.name)

			store.commit('addProjectile', new projectile.Breaker(this.owner))

			this._remove()
		}
	}
}


//* M82

function M82(owner, name) {
	mixins.canHaveLaserSight(owner, name) // On by default for m82

	const props = {
		owner,
		name
	}

	return {
		...props,
		...mixins.canRemoveSelf(),
		...mixins.hasAmmo(name),

		use() {
			console.log(this.name + " used by: " + this.owner.name)

			store.commit('addProjectile', new projectile.M82(this.owner))

			// Always last - decrements ammo and removes if ammo is out:
			this._handleAmmo()
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
		...mixins.hasChargeTime(props.name),
		...mixins.canRemoveSelf(),

		// No use() on chargeTimer equipment:
		_autoUse() {
			console.log(this.name + " used by: " + this.owner.name)

			const selfIndex = gameState().tanks.findIndex(i => i.equipment === this)
			const otherTank = this._randomTank(selfIndex)

			otherTank && this._swap(otherTank) // Has to check for undefined since this can happen during end timer with just 1 tank (random returns undefined)

			this._remove()
		},

		// Returns a random tank from state.tanks, an array (or single number) of excluded indices being optional:
		_randomTank(exclude = null) {

			// Copies tanks array:
			const tanks = [...gameState().tanks]

			if (exclude !== null) { // Has to check against null, since index 0 is also falsy

				// Removes any exclusions from clone:
				if (typeof exclude === 'number') { // Can use both single index (faster), or array of exclusions
					tanks.splice(exclude, 1)
				} else {
					for (let i = exclude.length - 1; i >= 0; i--) { //! Not sure if this works as intended
						const index = exclude[i]
						tanks.splice(index, 1)
					}
				}
			}

			// Returns random tank from remainder (or undefined if none are left):
			return p5.random(tanks)
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


//* COMPOSITIONAL MIXINS

const mixins = {
	canHaveLaserSight(owner, name) {
		// LS is added to equipment if the equipment is in the onEquipment array in LS config:
		if (config().modifier.laserSight.onEquipment.includes(name)) {
			owner.modifiers.add(new LaserSight(owner, 'laserSight'))
		}
	},

	hasAmmo(name) {
		return {
			ammo: config().equipment[name].ammo,

			_handleAmmo() {
				this.ammo--

				if (this.ammo <= 0) {
					this._remove()
				}
			}
		}
	},

	hasChargeTime(name) {
		return {
			chargeTime: config().equipment[name].chargeFrames,

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


//* LOOKUP DICTIONARY

// For generically looking up constructor from a string:
export default {
	Wormhole,
	M82,
	Breaker,
}
