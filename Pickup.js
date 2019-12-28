class Pickup { //* PICKUP !== WEAPON ETC. Pickup skal bare være objektet på banen. Det skal så kalde new XXX ved opsamling og sætte det nye objekt (baseret på selvstændig class) ind i inventory
	static pickups = { 
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

	static createPickup(pickupName) { 
		//TODO: Make pickup and put in maze based on just the name
	}
}