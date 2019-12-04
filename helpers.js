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
	return state.grid[col][row]
}

// Returns col and row num of cell
function getIndices(cell) {
	for (let colNum = 0; colNum < state.grid.length; colNum++) {
		const col = state.grid[colNum]
		for (let rowNum = 0; rowNum < col.length; rowNum++) {
			if (cell === state.grid[colNum, rowNum]) return [colNum, cellNum]
		}
	}
}

// Returns both reference to neighboring cell and the indices of the cell:
// function getNeighborIndices(col, row, direction) {
// 	for (let colNum = 0; colNum < state.grid.length; colNum++) {
// 		const col = state.grid[colNum]

// 		for (let rowNum = 0; rowNum < col.length; rowNum++) {
// 			const cell = col[rowNum]
// 			if (cell === currentCell) {
// 	return () => {
// 		switch (direction) {
// 			case 'up':
// 				return [col, row - 1]
// 				break
// 			case 'right':
// 				return [col + 1, row]
// 				break
// 			case 'down':
// 				return [col, row + 1]
// 				break
// 			case 'left':
// 				return [col - 1, row]
// 		}
// 	}



// 	return indices
// 	return [getCell(...indices), ...indices]
// }
// 	}
// }
// }


function moveToCell(currentCell, cell) {
	cell.visited = true
}

// Returns array of unvisited cells around given cell:
function getUnvisited(col, row) {
	const unvisitedCells = []

	// Up
	if (row - 1 >= 0) {
		const cell = getCell(col, row - 1)
		if (!cell.visited) unvisitedCells.push(cell)
	}

	// Right
	if (col + 1 <= config.environment.cellAmtX) {
		const cell = getCell(col + 1, row)
		if (!cell.visited) unvisitedCells.push(cell)
	}

	// Down
	if (row + 1 <= config.environment.cellAmtY) {
		const cell = getCell(col, row + 1)
		if (!cell.visited) unvisitedCells.push(cell)
	}

	// Left
	if (col - 1 >= 0) {
		const cell = getCell(col - 1, row)
		if (!cell.visited) unvisitedCells.push(cell)
	}

	return unvisitedCells
}

function mazify(col, row) {
	const cell = getCell(col, row)

	state.currentCell = cell
	cell.visited = true

	if (getUnvisited(col, row).length > 0) {
		
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