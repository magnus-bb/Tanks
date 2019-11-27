function setup() {
	frameRate(config.fps)
	// Makes world
	const canvasWidth = config.environment.cellWidth * config.environment.cellAmtX
	const canvasHeight = config.environment.cellWidth * config.environment.cellAmtY
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('canvas-container');

	// Sets cells, generates walls
	for (let x = 0; x < width; x += config.environment.cellWidth) {

		const column = []
		for (let y = 0; y < height; y += config.environment.cellWidth) {
			const cell = new Cell(x, y)
			cell.populateWalls()
			column.push(cell)
		}
		state.grid.push(column)
	}

	//! Creates players
	state.players.push(new Tank(
		'Tanko',
		Math.floor(Math.random() * width),
		Math.floor(Math.random() * height)
	))
	state.players.push(new Tank(
		'Tankarino',
		Math.floor(Math.random() * width),
		Math.floor(Math.random() * height),
		87, 68, 83, 65, 67
	))
}

// Keyboard handler for firing
function keyPressed() {
	for (const player of state.players) {
		if (keyCode == player.keybindings.fire) {
			player.fire()
		}
	}
}
