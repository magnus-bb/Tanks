config = {
	fps: 60,
	tank: {
		diameter: 20,
		moveSpeed: 1.5, // Has to be less than the width of walls to not pass through
		turnSpeed: 4,
		cannon: {
			length: 18,
			width: 3,
			midOffsetFraction: 5
		},
		ammo: 5,
		collisionMoveSlow: 2.5,
		collisionTurnSlow: 2,
		spawnDistance: 1, //TODO: Cells between spawned tanks
		defaultColor: 'ff0000',
	},
	env: { //TODO: omskriv til cell. og wall.
		cellWidth: 55,
		cellAmtX: 15,
		cellAmtY: 10,
		wallStroke: 6,
		wallOccurrence: 0.8,
		collisionLookaheadSteps: 3 // Same as bullet speed
	},
	bullet: {
		speed: 3,
		diameter: 8,
		duration: 6 * 60, // In frames
	},
	effects: {
		muzzleSize: 2.5, // Times the size of regular bullet
		muzzleSpeed: 1, // Px reduction per frame
		defaultShakeMagnitude: 2,
		bulletTrailAlpha: 80, // Out of 255
		bulletTrailLength: 30 // Frames / points
	}
}

