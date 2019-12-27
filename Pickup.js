class Pickup {
	static pickups = { //TODO: MAYBE REFACTOR TO BE ACTUAL OBJECTS IN CHARGE OF DISPLAYING THEMSELVES AND EVERYTHING, IF WE DO COMPOSITIONAL. OTHERWISE MAYBE MAKE THEM REFER TO SEPARATE CLASSES
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
		//TODO: THIS DEPENDS ON WHETHER WE CLONE FROM this.pickups OR IF WE MAKE CLASSES
	}
}