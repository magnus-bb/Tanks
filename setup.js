function setup() {
	frameRate(config.fps)
	const canvasWidth = config.env.cellWidth * config.env.cellAmtX
	const canvasHeight = config.env.cellWidth * config.env.cellAmtY
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('canvas-container')

	// Is overwritten in Game.start(), but makes a nice background to the start menu:
	Cell.generateGrid()
	Cell.populateWalls()
	Cell.generateMaze()

	// Game has to be started first:
	noLoop()
}
