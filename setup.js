function setup() {
	// Makes world
	const canvasWidth = config.environment.cellWidth * config.environment.cellAmtX
	const canvasHeight = config.environment.cellWidth * config.environment.cellAmtY
	createCanvas(canvasWidth, canvasHeight)

	// Sets cells, generates walls and draws them
	for (let x = 0; x < width; x += config.environment.cellWidth) {
		for (let y = 0; y < height; y += config.environment.cellWidth) {
			state.cells.push(new Cell(x, y))
		}
	}
	for (const cell of state.cells) {
		cell.populateWalls()
	}

	// Creates a player
	state.players.push(new Tank(
		'Magnus',
		Math.floor(Math.random() * width),
		Math.floor(Math.random() * height)
	)
	)

	state.players.push(new Tank(
		'Helena',
		Math.floor(Math.random() * width),
		Math.floor(Math.random() * height),
		'KeyW', 'KeyD', 'KeyS', 'KeyA', 'KeyC'
	))

	// Set keybindings for firing (must be done AFTER all tanks have been created)
	for (const player of state.players) {
		document.addEventListener('keydown', e => {
			if (e.code === player.keybindings.fire) {
				player.fire()
			}
		})
	}
}


//! Keyboard Moves
// Whether a key is down can be accessed in the state-object
document.addEventListener('keydown', e => {
	state.pressedKeys[e.code] = true
})
document.addEventListener('keyup', e => {
	state.pressedKeys[e.code] = false
})
