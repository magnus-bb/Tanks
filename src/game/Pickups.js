import Equipment from './Equipment.js'
import Modifier from './Modifiers.js'
import Powerup from './Powerups.js'
import { getCell, randomCoords, circleIntersectsRect } from './helpers.js'

import store from '@/store'
const { p5, assets } = store.state
const { config, gameState } = store.getters


function EquipmentPickup(name, type, x, y, col, row) {
	return {
		...Pickup.mixins.hasBaseProps(name, type, x, y, col, row),
		...Pickup.mixins.canBePickedUp(),
		...Pickup.mixins.canShowAndRemoveSelf(),

		_checkPrerequisites(tank) {
			return !tank.equipment
		},

		_pickedUp(i, tank) {
			tank.equipment = this._toEquipment(tank)

			this._remove(i)
		},

		_toEquipment(tank) {
			const className = this.name.capitalize()

			// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in equipment:
			return new Equipment[className](tank, this.name)
		}
	}
}

function ModifierPickup(name, type, x, y, col, row) {
	return {
		...Pickup.mixins.hasBaseProps(name, type, x, y, col, row),
		...Pickup.mixins.canBePickedUp(),
		...Pickup.mixins.canShowAndRemoveSelf(),

		_checkPrerequisites(tank) {
			// Return true if no applied modifiers are dupes of this pickup:
			for (const mod of tank.modifiers) {
				if (mod.name === this.name) return false
			}

			return true
		},

		_pickedUp(i, tank) {
			tank.modifiers.push(this._toModifier(tank))

			this._remove(i)
		},

		_toModifier(tank) {
			const className = this.name.capitalize()

			// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in modifier:
			return new Modifier[className](tank, this.name)
		}
	}
}

function PowerupPickup(name, type, x, y, col, row) {
	return {
		...Pickup.mixins.hasBaseProps(name, type, x, y, col, row),
		...Pickup.mixins.canBePickedUp(),
		...Pickup.mixins.canShowAndRemoveSelf(),

		_checkPrerequisites(tank) {
			//TODO: MAX NUMBER FOR EVERY POWERUP? COOLDOWN IN BETWEEN?
			return true
		},

		_pickedUp(i, tank) {
			tank.powerups.push(this._toPowerup(tank))

			this._remove(i)
		},

		_toPowerup(tank) {
			const className = this.name.capitalize()

			// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in modifier:
			return new Powerup[className](tank, this.name)
		}
	}
}


//* STATIC METHODS

const Pickup = {
	pickups: {
		powerup: ['ammo', 'shrinkRay'],
		equipment: ['m82', 'wormhole', 'breaker'],
		modifier: ['stealthAmmo']
	},

	spawn() {
		if (p5.frameCount % config().pickup.spawnInterval === 0 && gameState().pickups.length < config().cell.xAmt * config().cell.yAmt) {
			p5.random() < config().pickup.spawnChance ? this.create(this.random()) : false
		}
	},

	// Returns random pickup name, optionally in a category:
	random(type = null) {
		// Random from type:
		if (type) {
			if (this.pickups[type]) {

				return p5.random(this.pickups[type])
			}

			// Random from all:
		} else {
			const allPickups = []
			for (const type of Object.values(this.pickups)) {
				allPickups.push(...type)
			}

			return p5.random(allPickups)
		}
	},

	create(pickupName, cellIndices = null) {
		if (cellIndices) {
			var { col, row } = cellIndices
			var { x, y } = getCell(col, row).midpoint
		} else {
			var { x, y, col, row } = randomCoords()

			// Remake if pickup is already at this location:
			for (const pickup of gameState().pickups) {
				if (col === pickup.col && row === pickup.row) {
					return this.create(pickupName)
				}
			}
		}

		for (const type in this.pickups) { // Has to use for...in, since type should be the string value of the key
			if (this.pickups[type].includes(pickupName)) {
				var pickupType = type
				break
			}
		}

		if (pickupType === 'equipment') {
			var pickup = new EquipmentPickup(pickupName, pickupType, x, y, col, row)

		} else if (pickupType === 'modifier') {
			var pickup = new ModifierPickup(pickupName, pickupType, x, y, col, row)

		} else if (pickupType === 'powerup') {
			var pickup = new PowerupPickup(pickupName, pickupType, x, y, col, row)
		}

		// Adds to maze to be rendered if maze is not full:
		if (gameState().pickups.length < config().cell.xAmt * config().cell.yAmt) {
			store.commit('addPickup', pickup)
		}
	},


	//* COMPOSITIONAL MIXINS

	mixins: {
		hasBaseProps(name, type, x, y, col, row) { //TODO: Not necessary unless non-passed values are added
			return {
				name,
				type,
				x,
				y,
				col,
				row,
				asset: assets.pickups[name],
				size: config().pickup.size
			}
		},

		canBePickedUp() {
			return {
				pickup(i, tank) {
					if (this._checkIntersection(tank) && this._checkPrerequisites(tank)) { // In subclasses
						this._pickedUp(i, tank) // In subclasses
					}
				},

				_checkIntersection(tank) {
					const tankBody = {
						x: tank.x,
						y: tank.y,
						r: tank.r
					}

					const pickupRect = {
						x: this.x - this.size / 2,
						y: this.y - this.size / 2,
						h: this.size,
						w: this.size
					}

					if (circleIntersectsRect(tankBody, pickupRect)) {
						return true
					}
				}
			}
		},

		canShowAndRemoveSelf() {
			return {
				_show() {
					p5.image(this.asset, this.x, this.y, this.size, this.size)
				},

				_remove(i) {
					// Removes self from maze:
					store.commit('removePickup', i)
				},

				onFrame() {
					this._show()
				}
			}
		}
	}
}

export default Pickup
