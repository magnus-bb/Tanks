config = {
	fps: 60,
	player: {
		diameter: 20,
		moveSpeed: 2,
		turnSpeed: 4.5,
		color: [30, 170, 30],
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
		speed: 3,
		diameter: 8,
		framesAlive: 999 //*60 * 6 // 60fps * 5seconds
	}
}

