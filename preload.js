const assets = {
	pickups: {},
}

function preload() {
	// Runs through all types of pickups in Pickup.pickups, loads their asset, and saves it in the assets-object:
	for (const type of Object.values(Pickup.pickups)) {
		type.forEach(pickup => assets.pickups[pickup] = loadImage(`assets/pickups/${pickup}.svg`))
	}
}