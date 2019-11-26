config = {
	fps: 60,
	player: {
		diameter: 20,
		moveSpeed: 2, // Has to be less than the width of walls to not pass through
		turnSpeed: 4.5,
		cannonLength: 18,
		ammo: 3
	},
	environment: {
		cellWidth: 55,
		cellAmtX: 20,
		cellAmtY: 15,
		wallWidth: 6,
		wallChance: 0.5//*0.2
	},
	bullet: {
		speed: 3, // Has to be less than the width of walls to not pass through
		diameter: 8,
		framesAlive: 999 //*60 * 6 // 60fps * 5seconds
	}
}

