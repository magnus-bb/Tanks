function setup() {
	noLoop()

	frameRate(config.fps)
	const canvasWidth = config.env.cellWidth * config.env.cellAmtX
	const canvasHeight = config.env.cellWidth * config.env.cellAmtY
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('canvas-container')

	// Is overwritten in Game.start(), but makes a nice background to the start menu:
	Cell.generateGrid()
	Cell.populateWalls()
	Cell.generateMaze()

	imageMode(CENTER)
	angleMode(DEGREES)
}
