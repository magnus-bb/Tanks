class Pickup { //* PICKUP !== WEAPON ETC. Pickup skal bare være objektet på banen. Det skal så kalde new XXX ved opsamling og sætte det nye objekt (baseret på selvstændig class) ind i inventory
	//* STATIC PROPS

	static pickups = {
		powerup: ['ammo'],
		equipment: ['m82', 'wormhole', 'breaker'],
		modifier: ['stealthAmmo']
	}

	//* STATIC METHODS

	static spawn() {
		if (frameCount % config.pickup.spawnInterval === 0) {
			random() < config.pickup.spawnChance ? this.create(this.random()) : false
		}
	}

	// Returns random pickup name, optionally in a category:
	static random(type = null) {
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
	}

	static create(pickupName, cellIndices = null) { 

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

		const pickup = new Pickup(pickupName, pickupType, x, y, col, row)

		// Adds to maze to be rendered if maze is not full:
		if (state.pickups.length < config.cell.xAmt * config.cell.yAmt) {
			state.pickups.push(pickup)
		}
	}
	
	//* INSTANCE
	constructor(name, type, x, y, col, row) {
		this.name = name
		this.type = type
		this.x = x
		this.y = y
		this.col = col
		this.row = row
		this.asset = assets.pickups[this.name]
	}

	pickup(i, tank) {
		if (this._checkIntersection(tank) && this._checkPrerequisites(tank)) {
			this._pickedUp(i, tank)
		}
	}

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

	_checkPrerequisites(tank) {
		// If the pickup is equipment type:
		if (this.type === 'equipment') {
			// Return true if tank has nothing equipped:
			return !tank.equipment

			// If the pickup is a timed modifier:
		} else if (this.type === 'modifier') {
			// Return true if no applied modifiers are dupes of this pickup:
			for (const mod of tank.modifiers) {
				if (mod.name === this.name.capitalize()) return false
			}

			return true
		} else {
			//TODO: POWERUP PREREQS?
			return true
		}
	}

	_pickedUp(i, tank) {
		const className = this.name.capitalize()

		if (this.type === 'equipment') {
			tank.equipment = this._toEquipment(tank, className)
		} else if (this.type === 'modifier') {
			tank.modifiers.add(this._toModifier(tank, className))
		} else {
			tank.powerups.push(this._toPowerup(tank, className))
		}

		// Removes self from maze:
		state.pickups.splice(i, 1)
	}

	_toEquipment(tank, className) {
		// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in equipment:
		return new equipment[className](tank, className)
	}

	_toModifier(tank, className) {
		// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in modifier:
		return new modifier[className](tank, className)
	}

	_toPowerup(tank, className) {
		// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in modifier:
		return new powerup[className](tank, className)
	}

	_show() {
		image(this.asset, this.x, this.y, config.pickup.size, config.pickup.size)
	}

	// Called every frame:
	onFrame() {
		this._show()
	}
}

class EquipmentPickup extends Pickup {
	constructor(name, type, x, y, col, row) {
		super(name, type, x, y, col, row)
	}
}

class ModifierPickup extends Pickup {
	constructor(name, type, x, y, col, row) {
		super(name, type, x, y, col, row)
	}
}

class PowerupPickup extends Pickup {
	constructor(name, type, x, y, col, row) {
		super(name, type, x, y, col, row)
	}
}