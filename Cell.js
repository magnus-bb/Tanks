class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.env.cellWidth
		// Makes a wall at chance, if wall is not on canvas edge
		this.walls = {
			right: null,
			bottom: null
		}

		// For creating the maze:
		this.visited = false
	}

	//* SETUP PROPS

	static cellStack = []

	//* INSTANCE METHODS

	randomWall(side) {
		return random() < config.env.wallOccurrence ? new Wall(this, side) : null
	}

	//* STATIC METHODS

	static resetGrid() {
		state.grid = []

		// The grid has to be present for calculating starting positions of tanks before maze is generated:
		this.generateGrid()
	}

	static generateGrid() {
		for (let x = 0; x < width; x += config.env.cellWidth) { // Uses width / height of canvas (based off amt of cells and cellwidth) to generate rows and columns of cells
			const column = []
	
			for (let y = 0; y < height; y += config.env.cellWidth) {
				column.push(new Cell(x, y))
			}

			state.grid.push(column)
		}
	}

	// Goes through all cells and randomly populates walls
	static populateWalls() {
		for (const col of state.grid) {
			for (const cell of col) {

				if (cell.x !== width - config.env.cellWidth) {
					cell.walls.right = cell.randomWall('right')
				}
				if (cell.y !== height - config.env.cellWidth) {
					cell.walls.bottom = cell.randomWall('bottom')
				}
			}
		}
	}

	static generateMaze() {
		// Starts maze generation: 
		const initialIndices = [0, 0] // Starting point does not matter
		const initialCell = getCell(...initialIndices)
	
		initialCell.visited = true
		Cell.cellStack.push(initialCell)
	
		while (Cell.cellStack.length > 0) {
			const currentCell = Cell.cellStack.pop()
	
			const unvisitedCells = getUnvisitedNeighbors(currentCell)
			if (unvisitedCells.length > 0) {
				Cell.cellStack.push(currentCell)
	
				const data = random(unvisitedCells)
				const nextCell = data.cell
				const dir = data.dir
	
				removeWall(currentCell, nextCell, dir)
				nextCell.visited = true
				Cell.cellStack.push(nextCell)
			}
		}
	}
}