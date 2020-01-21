function setup() {
	noLoop()
	noCursor()

	frameRate(config.fps)
	const canvasWidth = config.cell.width * config.cell.xAmt
	const canvasHeight = config.cell.width * config.cell.yAmt
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('canvasContainer')

	// Is overwritten in Game.start(), but makes a nice background to the start menu:
	Cell.generateGrid()
	Cell.populateWalls()
	Cell.generateMaze()

	imageMode(CENTER)
	angleMode(DEGREES)
}

