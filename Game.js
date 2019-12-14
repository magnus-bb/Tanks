class Game {
	static started = false
	static paused = true
	static players = []

	//* METHODS

	static addPlayer(name, controls) { //TODO: Prime controls separately and use it here
		if (!this.started) {
			const coords = Cell.randomCellCoords()
			this.players.push(new Tank(name, coords.x, coords.y, controls))
		}
	}

	static start() {
		if (!this.started) {
			console.log('Game started')

			// Sets walls and generates maze:
			Cell.populateWalls()
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
		} else {
			console.log('Game has already started')
		}
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