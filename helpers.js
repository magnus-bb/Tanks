// Converts a direction and speed to new coords:
function getOffsetPoint(dist, dir, drive = 'forward') { // Defaults to 'forward' since it is used for more than just moving objects
	if (drive === 'backward') {
		return {
			x: -dist * cos(radians(dir)),
			y: -dist * sin(radians(dir))
		}
	} else if (drive === 'forward') {
		return {
			x: dist * cos(radians(dir)),
			y: dist * sin(radians(dir))
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

		// Lower left and top right quadrant:
	} else if (dir.between(90, 180, false) || dir.between(-270, -180, false) || dir > 270 || dir.between(-90, 0, false)) {
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

// Takes a point and a rect-object and returns true if the point exists inside the four points that make up a rectangle:
function pointInRect(pointX, pointY, rect) {
	if (pointX.between(rect.x1, rect.x2) && pointY.between(rect.y1, rect.y2)) {
		return true
	} else {
		return false
	}
}



//* https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
function bodyIntersectsWall(body, wall) {
	const distX = abs(body.x - wall.x - wall.w/2)
	const distY = abs(body.y - wall.y - wall.h/2)

	if (distX > (wall.w/2 + body.r) || distY > (wall.h/2 + body.r)) return false 

	if (distX <= (wall.w/2) || distY <= (wall.h/2)) return true

	const dx = distX - wall.w/2
	const dy = distY - wall.h/2

	return (dx*dx + dy*dy <= body.r * body.r)
}

function bodyIntersectsEdge(body) {
	const wallHalfWidth = config.env.wallStroke / 2

	if (body.x - body.r <= wallHalfWidth || body.x + body.r >= width - wallHalfWidth || body.y - body.r <= wallHalfWidth || body.y + body.r >= height - wallHalfWidth) {
		return true
	} else {
		return false
	}
}

// Returns a rectangle representation of a wall-object for different types of intersection checks:
function getWallRect(wall, circle = false) {
	const wallRect = {}

	if (circle) { //* For circle intersections:
		if (wall.x1 === wall.x2) {
			// Y is long axis:
			wallRect.x = wall.x1 - wall.w / 2
			wallRect.y = wall.y1
			wallRect.w = wall.w
			wallRect.h = wall.y2 - wall.y1
		} else {
			// X is long axis:
			wallRect.x = wall.x1
			wallRect.y = wall.y1 - wall.w / 2
			wallRect.w = wall.x2 - wall.x1
			wallRect.h = wall.w
		}
	} else { //* For single point intersections:
		if (wall.x1 === wall.x2) {
			// Y is long axis:
			wallRect.x1 = wall.x1 - wall.w / 2
			wallRect.x2 = wall.x2 + wall.w / 2
			wallRect.y1 = wall.y1
			wallRect.y2 = wall.y2
		} else {
			// X is long axis:
			wallRect.x1 = wall.x1
			wallRect.x2 = wall.x2
			wallRect.y1 = wall.y1 - wall.w / 2
			wallRect.y2 = wall.y2 + wall.w / 2
		}
	}

	return wallRect
}

function outOfBounds(pointX, pointY) {
	const wallHalfWidth = config.env.wallStroke / 2

	const out = {
		x: false,
		y: false
	}

	if (pointX <= wallHalfWidth || pointX >= width - wallHalfWidth) {
		out.x = true
	}

	if (pointY <= wallHalfWidth || pointY >= height - wallHalfWidth) {
		out.y = true
	}

	return out
}