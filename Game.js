class Game {
	static started = false
	static paused = true
	static players = [] //? evt et map til at holde styr på tanks?

	//* METHODS

	static addPlayer(player) {
		if (this.started) return console.log("Game has already started")

		this.players.push(player)

		// Uses index to ID the status-DIV:
		const index = this.players.length - 1

		// Shows div in status bar:
		Status.initPlayer(player, index) 
	}

	static new() {
		// Cannot start twice or if there are no players:
		if (this.started || this.players.length <= 0) return console.log("Cannot start game")

		$('#start-menu').fadeOut(100)
		this.start()
	}

	static start() {
		console.log('Game started')

		// Wipes all cells and remakes them:
		Cell.resetGrid()
		// Sets random walls:
		Cell.populateWalls()
		// Removes specific walls to make sure every part is traversable:
		Cell.generateMaze()

		// Adds players' tanks:
		for (const player of this.players) {
			//TODO: ADD SPAWN DISTANCE TO randomSpawnCoords()

			let spawnCoords = Tank.randomSpawnCoords()
			while (pointCloseToTank(spawnCoords)) {
				spawnCoords = Tank.randomSpawnCoords
			}

			state.tanks.push(new Tank(player.name, player.color, spawnCoords.x, spawnCoords.y, player.controls, player))
		}

		this.started = true

		$('#next-round-menu').fadeOut(100)
		// Hides menu:
		this.unpause()
	}

	static end() {
		console.log('Game ended')

		// Resets all ingame state:
		state = new GameState

		this.started = false
		
		//TODO: CHANGE TO ANOTHER MENU, SO IT WILL BE DISPLAYED WHEN pause() SHOWS GAMEMENU
		$('#next-round-menu').fadeIn(100)
		this.pause()
	}

	static pause() {
		console.log('Game paused')

		this.paused = true
		noLoop()

		$('#game-menu').slideDown()
	}

	static unpause() {
		console.log('Game unpaused')

		// Restarts when menu is gone:
		$('#game-menu').slideUp(() => {
			this.paused = false
			loop()
		})
	}
}