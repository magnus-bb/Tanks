export default class Config {
	constructor(configuration = null) { // If configuration is null (first time) everything should be defaults
		this.fps = 60
		this.bgColor = '#c4c4c4'
		this.strokeColor = '#020817'
		this.game = {
			endFrames: 60 * 4 // Seconds
		}
		this.pickup = {
			size: 25, // ~25px should be default for designs
			spawnInterval: 60 * 5, // Secs
			spawnChance: 0.6
		}
		this.projectile = { // Used / when drawn
			bullet: {
				speed: 3,
				diameter: 8,
				duration: 60 * 6, // Seconds
			},
			m82: {
				speed: 15,
				penetrationSpeedDivisor: 2,
				stealthModifier: 2
			},
			breaker: {
				speed: 3
			}
		}
		this.equipment = { // Using / when equipped
			wormhole: {
				chargeFrames: 60 * 2 // Seconds
			},
			m82: {
				ammo: 3
			},
		}
		this.modifier = {
			laserSight: {
				onEquipment: ['m82'],
				possibleOn: ['m82', 'breaker'], // For config
				width: 1,
				alpha: 50
			},
			stealthAmmo: {
				duration: 60 * 10,
				alpha: 15
			},
		}
		this.tank = {
			diameter: 20,
			moveSpeed: 1.5, // Has to be less than the width of walls to not pass through
			turnSpeed: 4,
			ammo: 5,
			collisionMoveSlow: 2.5,
			collisionTurnSlow: 2,
			spawnDistance: 1,
			cannon: {
				length: 18,
				width: 3,
				midOffsetDivisor: 5
			},
		}
		this.cell = {
			width: 55, // px
			xAmt: 15,
			yAmt: 10,
		}
		this.wall = {
			strokeWidth: 6,
			occurrenceRate: 0.8,
			get collisionStepSize() { return this.strokeWidth - 1 }, // Projectiles will always be able to 'hit' wall
		}

		const particleColor = [255, 255, 255, 80]
		const connectionColor = [255, 255, 255, particleColor[3] * 0.5]
		const particleAmt = this.cell.xAmt * this.cell.yAmt / 4
		const connectionDistance = this.cell.width * 3
		this.fx = {
			muzzle: {
				size: 2.5, // Times the size of regular bullet
				speed: 1, // Px reduction per frame
			},
			shakeMagnitude: 2,
			bulletTrail: {
				on: true,
				alpha: 80, // Out of 255
				length: 25, // Frames / points
			},
			particle: {
				diameter: 8,
				color: particleColor,
				velocity: 1.5,
				amt: particleAmt,
				connection: {
					distance: connectionDistance,
					color: connectionColor,
					width: 2,
				}
			}
		}
	}


	//* LOCAL STORAGE MANAGEMENT

	// Defaults to save "equipped" config, but can save another config:
	static saveConfig(name, configuration = config) {
		if (!configuration) throw "There is no configuration to save!"

		// If config with name already exists:
		if (localStorage.getItem(name)) {
			//TODO: Are you sure you want to overwrite the already existing config with this name?
			console.log("Config already exists")
		} else {
			localStorage.setItem(name, JSON.stringify(configuration))

			return config
		}
	}

	static loadConfig(name) {
		if (!localStorage.getItem(name)) throw "No configuration exists with that name!"

		config = JSON.parse(localStorage.getItem(name))

		return config
		//TODO: Loaded!
	}

	static removeConfig(name) {
		localStorage.removeItem(name)
	}

	static clearConfigs() {
		localStorage.clear()
	}
}

//TODO: Load last used from local storage
// let config = new Config