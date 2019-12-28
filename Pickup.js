class Pickup { //* PICKUP !== WEAPON ETC. Pickup skal bare være objektet på banen. Det skal så kalde new XXX ved opsamling og sætte det nye objekt (baseret på selvstændig class) ind i inventory
	constructor(name, x, y) {
		this.name = name
		this.x = x
		this.y = y
		this.rotation = random(0, 360) //? Maybe inherit rotation if pickup is swapped with something already equipped
	}

	//* INSTANCE METHODS

	get asset() {
		return assets.pickups[this.name]
	}

	show() {
		push()

		translate(this.x, this.y)
		rotate(this.rotation)
		image(this.asset, 0, 0, config.pickup.size, config.pickup.size)

		pop()
	}

	//* STATIC PROPS

	static pickups = { //! DELETE PLACEHOLDERS
		offensive: ['placeholder'],
		defensive: ['placeholder2'],
		instaUse: ['placeholder3'],

	}

	//* STATIC METHODS

	// Returns random pickup name, optionally in a category:
	static randomPickup(type = null) {
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

	static createPickup(pickupName, coords = false) { 

		// Uses given coords or randomCoords:
		const { x, y } = coords || randomSpawnCoords()

		const pickup = new Pickup(pickupName, x, y)

		// Adds to maze to be rendered:
		state.pickups.push(pickup)
	}
}