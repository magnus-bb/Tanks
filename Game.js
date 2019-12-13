class Game {
	static gameStarted = false
	static players = []

	static addPlayer(name, controls) { //TODO: Prime controls separately and use it here
		if (!this.gameStarted) {
			const coords = Cell.randomCellCoords()
			this.players.push(new Tank(name, coords.x, coords.y, controls))
		}
	}

	static startGame() {
		if (!this.gameStarted) {
			console.log('Game started')

			// Sets walls and generates maze
			Cell.populateWalls()
			Cell.generateMaze()

			// Adds players:
			state.players.push(...this.players)

			
			this.gameStarted = true
		} else {
			console.log('Game has already started')
			//TODO: Cannot start game twice msg
		}
	}

	static endGame() {
		console.log('Game ended')


		this.gameStarted = false
	}
}