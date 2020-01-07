class Pickup { //* PICKUP !== WEAPON ETC. Pickup skal bare være objektet på banen. Det skal så kalde new XXX ved opsamling og sætte det nye objekt (baseret på selvstændig class) ind i inventory
	constructor(name, type, x, y, col, row) {
		this.name = name
		this.type = type
		this.x = x
		this.y = y
		this.col = col
		this.row = row
	}

	//* INSTANCE METHODS

	get asset() {
		return assets.pickups[this.name]
	}

	checkCollision(tank) {

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

	pickedUp(i, tank) {
		tank.equipment = this.toEquipment(tank)

		// Removes self from maze:
		state.pickups.splice(i, 1)
	}

	toEquipment(tank) {
		const className = this.name.capitalize()

		// Returns an instantiation of the class corresponding to this pickup's name by doing a lookup in equipment:
		return new equipment[className](tank, className)
	}

	show() {
		image(this.asset, this.x, this.y, config.pickup.size, config.pickup.size)
	}

	// Called every frame:
	onFrame() {
		this.show()
	}

	//* STATIC PROPS

	static pickups = { //! DELETE PLACEHOLDERS
		offensive: ['placeholder'],
		defensive: [],
		instaUse: ['wormhole'],

	}

	//* STATIC METHODS

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
			var { x, y } = getCell(col, row).getMidpoint()
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
		if (state.pickups.length < config.env.cellAmtX * config.env.cellAmtY) {
			state.pickups.push(pickup)
		}
	}
}