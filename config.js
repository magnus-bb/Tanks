class Config {
	constructor(configuration = null) { // If configuration is null (first time) everything should be defaults
		this.fps = 60
		this.game = {
			endFrames: 60 * 3 // Seconds
		}
		this.pickup = {
			size: 25, // ~25px should be default for designs
			spawnInterval: 60 * 5, // Secs
			spawnChance: 0.5
		}
		this.equipment = {
			wormhole: {
				chargeFrames: 60 * 2 // Seconds
			},
			m82: {
				ammo: 3,
				speed: 12,
				penetrationSpeedDivisor: 3,
				stealthModifier: 2
			},
			breaker: {
				speed: 3
			}
		},
		this.modifiers = {
			stealthAmmo: {
				duration: 60 * 10,
				alpha: 15
			},
		},
		this.tank = {
			diameter: 20,
			moveSpeed: 1.5, // Has to be less than the width of walls to not pass through
			turnSpeed: 4,
			ammo: 5,
			collisionMoveSlow: 2.5,
			collisionTurnSlow: 2,
			spawnDistance: 1,
			defaultColor: 'ff0000', //? remove
			cannon: {
				length: 18,
				width: 3,
				midOffsetDivisor: 5
			},
		}
		this.bullet = {
			speed: 3,
			diameter: 8,
			duration: 60 * 6, // Seconds
		}
		this.cell = {
			width: 55, // px
			xAmt: 15,
			yAmt: 10,
			color: '#c4c4c4'
		}
		this.wall = {
			strokeWidth: 6,
			occurrenceRate: 0.8,
			get collisionStepSize() { return this.strokeWidth - 1 }, // Will always be able to 'hit' wall
			color: '#222629'
		}
		this.fx = {
			muzzleSize: 2.5, // Times the size of regular bullet
			muzzleSpeed: 1, // Px reduction per frame
			defaultShakeMagnitude: 2,
			bulletTrailAlpha: 80, // Out of 255
			bulletTrailLength: 25 // Frames / points
		}
	}

	//* Config Saving

	//TODO: To be saved as local storage
	static saved = {}

	
	static saveConfig(name, configuration) {
		if (this.saved[name]) {
			//TODO: Do you want to overwrite? Prompt
			this.saved[name] = new Config(configuration)
		} else {
			this.saved[name] = configuration
			//TODO: Config saved!
		}
	}
	
	static loadConfig(name) {
		config = this.saved[name]
		//TODO: Loaded!
	}
}

//TODO: Load last used from local storage
let config = new Config