// Converts a direction and speed to new coords:
function getMoveCoords(speed, direction, drive = null) { //TODO: Omskriv til noget andet, bruges mere til andet end move
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

// Converts difference in x and y coords to a direction in degrees:
function getDirection(dX, dY) {
	let direction = atan2(dY, dX) // x & y are reversed because of the function, don't change
	return degrees(direction)
}

function randomColor() {
	return color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
}

// Every number can call .between:
Number.prototype.between = function(min, max, include = true) { // Cannot be arrow function because of 'this'-binding
	if (include) {
		return this <= max && this >= min
	} else {
		return this < max && this > min
	}
}

// Returns left (-1) or right (1) based on the axis of collision and pointing direction of tank
function getTurnDirection(collisionAxis, dir) {
	// Lower right and top left quadrant:
	if (dir.between(0, 90, false) || dir < -270 || dir.between(180, 270, false) || dir.between(-180, -90, false)) {
		return collisionAxis === 'x' ? 1 : -1
	}
	// Lower left and top right quadrant:
	if (dir.between(90, 180, false) || dir.between(-270, -180, false) || dir > 270 || dir.between(-90, 0, false)) {
		return collisionAxis === 'x' ? -1 : 1
	}
}

// Returns reference to cell:
function getCell(col, row) {
	try {
		return state.grid[col][row]
	}
	catch (err) {
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

function removeWall(fromCell, toCell, dir) {
	if (dir === 'up') {
		toCell.walls.bottom = null
	} else if (dir === 'right') {
		fromCell.walls.right = null
	} else if (dir === 'down') {
		fromCell.walls.bottom = null
	} else if (dir === 'left') {
		toCell.walls.right = null
	}
}

// Returns array of unvisited cells around given cell and their direction from the given cell:
function getUnvisitedNeighbors(currentCell) {
	const indices = getIndices(currentCell)
	const col = indices[0]
	const row = indices[1]

	const unvisitedCells = []

	// Up
	if (row - 1 >= 0) {
		const cell = getCell(col, row - 1)
		if (!cell.visited) {
			unvisitedCells.push({ cell: cell, dir: 'up' })
		}
	}

	// Right
	if (col + 1 < config.env.cellAmtX) {
		const cell = getCell(col + 1, row)
		if (!cell.visited) {
			unvisitedCells.push({ cell: cell, dir: 'right' })
		}
	}

	// Down
	if (row + 1 < config.env.cellAmtY) {
		const cell = getCell(col, row + 1)
		if (!cell.visited) {
			unvisitedCells.push({ cell: cell, dir: 'down' })
		}
	}

	// Left
	if (col - 1 >= 0) {
		const cell = getCell(col - 1, row)
		if (!cell.visited) {
			unvisitedCells.push({ cell: cell, dir: 'left' })
		}
	}

	return unvisitedCells
}

function getColorButtonVal() {
	return $('#player-color-button')[0].jscolor.rgb
}