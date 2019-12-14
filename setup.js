function setup() {
	frameRate(config.fps)
	// Makes world
	const canvasWidth = config.env.cellWidth * config.env.cellAmtX
	const canvasHeight = config.env.cellWidth * config.env.cellAmtY
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('game-container')

	// Makes grid structure
	Cell.generateGrid()

	// Game has to be started first:
	noLoop()
}
