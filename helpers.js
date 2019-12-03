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

function getCell(row, col) {
	return state.grid[row][col]
}

function getNeighborCell(currentCell, direction) {
	// Values to return are the index nums in loops:
	state.grid.forEach((col, colNum) => {
		col.forEach((cell, cellNum) => {
			if (cell === currentCell) {
				switch (direction) {
					case 'up':

						break
					case 'right':

						break
					case 'down':

						break
					case 'left':


				}
			})
	})
}
}


function mazifyCell(currentCell) {
	currentCell.visited = true



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

	// Removes walls in maze pattern: //* https://en.wikipedia.org/wiki/Maze_generation_algorithm





	// Removes some more random walls:

}