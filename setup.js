function setup() {
	noLoop()

	frameRate(Config.current.fps)
	const canvasWidth = Config.current.cell.width * Config.current.cell.xAmt
	const canvasHeight = Config.current.cell.width * Config.current.cell.yAmt
	const canvas = createCanvas(canvasWidth, canvasHeight)
	canvas.parent('canvasContainer')

	// Is overwritten in Game.start(), but makes a nice background to the start menu:
	Cell.generateGrid()
	Cell.populateWalls()
	Cell.generateMaze()

	imageMode(CENTER)
	angleMode(DEGREES)
}

