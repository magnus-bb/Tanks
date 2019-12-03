config = {
	fps: 60,
	player: {
		diameter: 20,
		moveSpeed: 1.5, // Has to be less than the width of walls to not pass through
		turnSpeed: 4,
		cannonLength: 18,
		ammo: 3,
		collisionSlowFactor: 2
	},
	environment: {
		cellWidth: 55,
		cellAmtX: 15,
		cellAmtY: 10,
		wallWidth: 6,
		wallOccurrence: 0.5,
		collisionLookaheadSteps: 3 // Same as bullet speed
	},
	bullet: {
		speed: 3,
		diameter: 8,
		framesAlive: 60 * 6 // 60fps * 5seconds
	},
	effects: {
		muzzleSize: 2,
		defaultShakeMagnitude: 2,
		bulletTrailAlpha: 50
	}
}

