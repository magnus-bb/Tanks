config = {
	fps: 60,
	player: {
		diameter: 20,
		moveSpeed: 1.5, // Has to be less than the width of walls to not pass through
		turnSpeed: 4,
		cannonLength: 18,
		ammo: 5,
		collisionSlowFactor: 4,
		collisionTurnFactor: 10,
		spawnDistance: 4 //TODO: Cells between spawned tanks
	},
	env: {
		cellWidth: 55,
		cellAmtX: 15,
		cellAmtY: 10,
		wallWidth: 6,
		wallOccurrence: 0.8,
		collisionLookaheadSteps: 3 // Same as bullet speed
	},
	bullet: {
		speed: 3,
		diameter: 8,
		duration: 6 * 60, // In frames
		destructionText: "Poof!",
		destructionEffectDuration: 60, // In frames
	},
	effects: {
		muzzleSize: 2.5, // Times the size of regular bullet
		muzzleSpeed: 1, // Px reduction per frame
		defaultShakeMagnitude: 2,
		bulletTrailAlpha: 100, // Out of 255
		bulletTrailLength: 30 // Frames / points
	}
}

