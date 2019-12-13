function setup() {
	frameRate(config.fps)
	// Makes world
	const canvasWidth = config.env.cellWidth * config.env.cellAmtX
	const canvasHeight = config.env.cellWidth * config.env.cellAmtY
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('canvas-container')

	// Makes grid structure
	Cell.generateGrid()
}

// Keyboard handler for firing:
function keyPressed() { // Cannot be done in class, since we have to listen for all keypresses, and keyDown will spam
	for (const player of state.players) {
		if (keyCode === player.controls.fire) {
			player.fire()
		}
	}
}
