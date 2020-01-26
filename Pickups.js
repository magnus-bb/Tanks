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
				if (mod.name === this.name.capitalize()) return false
			}

			return true
		},

		_pickedUp(i, tank) {
			tank.modifiers.add(this._toModifier(tank))

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
		powerup: ['ammo'],
		equipment: ['m82', 'wormhole', 'breaker'],
		modifier: ['stealthAmmo']
	},

	spawn() {
		if (frameCount % config.pickup.spawnInterval === 0 && state.pickups.length < config.cell.xAmt * config.cell.yAmt) {
			random() < config.pickup.spawnChance ? this.create(this.random()) : false
		}
	},

	// Returns random pickup name, optionally in a category:
	random(type = null) {
		// Random from type:
		if (type) {
			if (this.pickups.hasOwnProperty(type)) {

				return random(this.pickups[type])
			}

			// Random from all:
		} else {
			const allPickups = []
			for (const type of Object.values(this.pickups)) {
				allPickups.push(...type)
			}

			return random(allPickups)
		}
	},

	create(pickupName, cellIndices = null) {
		if (cellIndices) {
			var { col, row } = cellIndices
			var { x, y } = getCell(col, row).midpoint
		} else {
			var { x, y, col, row } = randomSpawnCoords()

			// Remake if pickup is already at this location:
			for (const pickup of state.pickups) {
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
		if (state.pickups.length < config.cell.xAmt * config.cell.yAmt) {
			state.pickups.push(pickup)
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
				asset: assets.pickups[name]
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
						x: this.x - config.pickup.size / 2,
						y: this.y - config.pickup.size / 2,
						h: config.pickup.size,
						w: config.pickup.size
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
					image(this.asset, this.x, this.y, config.pickup.size, config.pickup.size)
				},

				_remove(i) {
					// Removes self from maze:
					state.pickups.splice(i, 1)
				},

				onFrame() {
					this._show()
				}
			}
		}
	}
}