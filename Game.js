class Game {
	static started = false
	static paused = true
	static players = [] //? evt et map til at holde styr på tanks?

	//* METHODS

	static addPlayer(player) {
		if (this.started) return console.log("Game has already started")

		this.players.push(player)
	}

	static start() {
		// Cannot start twice or if there are no players:
		if (this.started || this.players.length <= 0) return console.log("Cannot start game")

		console.log('Game started')

		// Wipes all cells and remakes them:
		Cell.resetGrid()
		// Sets random walls:
		Cell.populateWalls()
		// Removes specific walls to make sure every part is traversable:
		Cell.generateMaze()

		// Adds players' tanks:
		for (const player of this.players) {
			//TODO: ADD SPAWN DISTANCE TO randomCellCoords()

			const spawnCoords = Cell.randomCellCoords()
			state.tanks.push(new Tank(player.name, player.color, spawnCoords.x, spawnCoords.y, player.controls))
		}

		// Hides menu:
		$('#game-menu').slideUp(() => {
			this.started = true
			this.paused = false

			// Starts drawing:
			loop()
		})
	}

	static end() {
		console.log('Game ended')


		this.started = false
		this.paused = true

		$('#game-menu').slideDown()
	}

	static pause() {
		console.log('Game paused')

		// Draw automatically pauses when it reads Game.paused to be true, but not other way around:
		this.paused = true

		$('#game-menu').slideDown()
	}

	static unPause() {
		console.log('Game unpaused')

		// Restarts when menu is gone:
		$('#game-menu').slideUp(() => {
			// change pause before looping, as to not get draw to re-pause:
			this.paused = false
			loop()
		})
	}
}