class Game {
	static started = false
	static paused = true
	static players = []

	//* METHODS

	static addPlayer(name, controls) { //TODO: Prime controls separately and use it here
		if (!this.started) {
			const coords = Cell.randomCellCoords()
			this.players.push(new Tank(name, coords.x, coords.y, controls)) //TODO: Change player objects to be something other than tanks (contain wins, deaths etc)
		}
	}

	static start() {
		// Cannot start twice or if there are no players:
		if (this.started || this.players.length <= 0) return console.log("An error ocurred")

		console.log('Game started')

		// Wipes all cells and remakes them:
		Cell.resetGrid()
		// Sets random walls:
		Cell.populateWalls()
		// Removes specific walls to make sure every part is traversable:
		Cell.generateMaze()

		// Adds players' tanks:
		state.tanks.push(...this.players) //TODO: Change player objects to be something other than tanks (contain wins, deaths etc)

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