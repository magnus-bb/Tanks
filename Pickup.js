class Pickup { //* PICKUP !== WEAPON ETC. Pickup skal bare være objektet på banen. Det skal så kalde new XXX ved opsamling og sætte det nye objekt (baseret på selvstændig class) ind i inventory
	constructor(name, type, x, y) {
		this.name = name
		this.type = type
		this.x = x
		this.y = y
		//this.rotation = random(0, 360) //? Maybe inherit rotation if pickup is swapped with something already equipped
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

	pickedUp(index, tank) {
		//TODO: create instance of pickup-specific class
		tank.weapon = this.name //! DELETE AND MAKE AN OBJECT, NOT JUST NAME OF PICKUP

		// Removes self from maze:
		state.pickups.splice(index, 1)
	}

	show() {
		//  push()

		// translate(this.x, this.y)
		// rotate(this.rotation)
		image(this.asset, this.x, this.y, config.pickup.size, config.pickup.size)

		// pop()
	}

	//* STATIC PROPS

	static pickups = { //! DELETE PLACEHOLDERS
		offensive: ['placeholder'],
		defensive: [],
		instaUse: [],

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

	static create(pickupName, coords = false) { 

		// Uses given coords or randomCoords:
		const { x, y } = coords || randomSpawnCoords()

		for (const type in this.pickups) {
			if (this.pickups[type].includes(pickupName)) {
				var pickupType = type
				break
			}
		}

		const pickup = new Pickup(pickupName, pickupType, x, y)

		// Adds to maze to be rendered:
		state.pickups.push(pickup)
	}
}