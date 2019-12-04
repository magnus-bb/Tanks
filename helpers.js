// Converts a direction and speed to new coords
function getMoveCoords(speed, direction, drive = false) {
	if (drive === 'backward') {
		return {
			x: -speed * cos(radians(direction)),
			y: -speed * sin(radians(direction))
		}
	} else if (drive === 'forward') {
		return {
			x: speed * cos(radians(direction)),
			y: speed * sin(radians(direction))
		}
	} else {
		return {
			x: 0,
			y: 0
		}
	}
}

// Converts difference in x and y coords to a direction in degrees
function getDirection(dX, dY) {
	let direction = atan2(dY, dX) // x & y are reversed because of the function, don't change
	return degrees(direction)
}

function randomColor() {
	return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

function randomWallSide() {
	const sides = ['top', 'right', 'bottom', 'left']
	const index = Math.floor(Math.random() * 4)
	return sides[index]
}

function between(number, min, max, include = true) { // Does not include max, since collisions will ping for several cells
	if (include) {
		return number <= max && number >= min
	} else {
		return number < max && number > min
	}
}

// Returns left (-1) or right (1) based on the axis of collision and pointing direction of tank
function getTurnDirection(collisionAxis, dir) {
	// Lower right and top left quadrant:
	if (between(dir, 0, 90, false) || dir < -270 || between(dir, 180, 270, false) || between(dir, -180, -90, false)) {
		return collisionAxis === 'x' ? 1 : -1
	}
	// Lower left and top right quadrant:
	if (between(dir, 90, 180, false) || between(dir, -270, -180, false) || dir > 270 || between(dir, -90, 0, false)) {
		return collisionAxis === 'x' ? -1 : 1
	}
}

// Returns reference to cell:
function getCell(col, row) {
	try {
		return state.grid[col][row]
	}
	catch(err) {
		console.log(col, row)
		throw err
	}
}

// Returns col and row num of cell:
function getIndices(cell) {
	for (let colNum = 0; colNum < state.grid.length; colNum++) {
		const col = state.grid[colNum]
		for (let rowNum = 0; rowNum < col.length; rowNum++) {
			if (state.grid[colNum][rowNum] === cell) return [colNum, rowNum]
		}
	}
}

//! LOL
function moveCell(currentCell, cell) {
	const prevIndices = getIndices(currentCell)
	const indices = getIndices(cell.cell)

	// Removes the correct wall:
	if (cell.dir === 'up') {
		cell.cell.walls.bottom = null
	} else if (cell.dir === 'right') {
		currentCell.walls.right = null
	} else if (cell.dir === 'down') {
		currentCell.walls.bottom = null
	} else if (cell.dir === 'left') {
		cell.cell.walls.right = null
	}
	
	mazify(...indices)
}

// Returns array of unvisited cells around given cell and their direction from the given cell:
function getUnvisitedNeighbors(col, row) {
	const unvisitedCells = []
	const data = {}

	// Up
	if (row - 1 >= 0) {
		const cell = getCell(col, row - 1)
		if (!cell.visited) {
			data.cell = cell
			data.dir = 'up'
			unvisitedCells.push(data)
		}
	}

	// Right
	if (col + 1 < config.environment.cellAmtX) {
		const cell = getCell(col + 1, row)
		if (!cell.visited) {
			data.cell = cell
			data.dir = 'right'
			unvisitedCells.push(data)
		}
	}

	// Down
	if (row + 1 < config.environment.cellAmtY) {
		const cell = getCell(col, row + 1)
		if (!cell.visited) {
			data.cell = cell
			data.dir = 'down'
			unvisitedCells.push(data)
		}
	}

	// Left
	if (col - 1 >= 0) {
		const cell = getCell(col - 1, row)
		if (!cell.visited) {
			data.cell = cell
			data.dir = 'left'
			unvisitedCells.push(data)
		}
	}

	return unvisitedCells
}

function mazify(col, row) {
	const cell = getCell(col, row)

	state.currentCell = cell
	cell.visited = true

	const unvisitedCells = getUnvisitedNeighbors(col, row)
	if (unvisitedCells.length > 0) {
		const nextCell = random(unvisitedCells)
		
		// Moves and removes wall:
		moveCell(cell, nextCell)
	}


}

function generateMaze() {
	// Uses width / height of canvas (based off amt of cells and cellwidth) to generate rows and columns of cells:
	for (let x = 0; x < width; x += config.environment.cellWidth) {
		const column = []

		for (let y = 0; y < height; y += config.environment.cellWidth) {
			// Makes all walls:
			const cell = new Cell(x, y)
			column.push(cell)
		}
		state.grid.push(column)
	}

	// Starts maze generation //* https://en.wikipedia.org/wiki/Maze_generation_algorithm
	mazify(0, 0)





	// Removes some more random walls:
}