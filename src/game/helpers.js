import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters

const helpers = {
	// Converts a direction and speed to new coords:
	getOffsetPoint(dist, dir, moving = 'forward') { // Defaults to 'forward' since it is used for more than just moving objects
		if (moving === 'forward') {
			return {
				x: dist * p5.cos(dir),
				y: dist * p5.sin(dir)
			}

		} else if (moving === 'backward') {
			return {
				x: -dist * p5.cos(dir),
				y: -dist * p5.sin(dir)
			}
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},

	// Converts difference in x and y coords to a direction in degrees:
	getDirection(dX, dY) {
		return p5.atan2(dY, dX) // x & y are reversed because of the atan2 function, don't change
	},

	// Returns left (-1) or right (1) based on the axis of collision and pointing direction of tank
	getTurnDirection(collisionAxis, dir) {
		// Lower right and top left quadrant:
		if (dir.between(0, 90, false) || dir < -270 || dir.between(180, 270, false) || dir.between(-180, -90, false)) {
			return collisionAxis === 'x' ? 1 : -1

			// Lower left and top right quadrant:
		} else if (dir.between(90, 180, false) || dir.between(-270, -180, false) || dir > 270 || dir.between(-90, 0, false)) {
			return collisionAxis === 'x' ? -1 : 1
		}
	},

	randomColor(alpha = null) {
		return p5.color(p5.floor(p5.random(256)), p5.floor(p5.random(256)), p5.floor(p5.random(256), alpha || 255 /*? alpha : 255*/))
	},

	// Returns reference to cell:
	getCell(col, row) {
		return gameState().grid[col][row]
	},

	// Returns col and row num of cell:
	getCellIndices(cell) {
		for (let colNum = 0; colNum < gameState().grid.length; colNum++) {
			const col = gameState().grid[colNum]
			for (let rowNum = 0; rowNum < col.length; rowNum++) {
				if (gameState().grid[colNum][rowNum] === cell) return [colNum, rowNum]
			}
		}
	},

	removeWall(fromCell, toCell, dir) {
		if (dir === 'up') {
			toCell.walls.bottom = null
		} else if (dir === 'right') {
			fromCell.walls.right = null
		} else if (dir === 'down') {
			fromCell.walls.bottom = null
		} else if (dir === 'left') {
			toCell.walls.right = null
		}
	},

	// Returns array of unvisited cells around given cell and their direction from the given cell:
	getUnvisitedNeighbors(currentCell) {
		const indices = getCellIndices(currentCell)
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
		if (col + 1 < config().cell.xAmt) {
			const cell = getCell(col + 1, row)
			if (!cell.visited) {
				unvisitedCells.push({ cell: cell, dir: 'right' })
			}
		}

		// Down
		if (row + 1 < config().cell.yAmt) {
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
	},

	// getColorButtonVal() {
	// 	return $('#playerColorButton')[0].jscolor.rgb
	// },

	// Takes a point and a rect-object and returns true if the point exists inside the four points that make up a rectangle:
	pointInRect(point, rect) {
		// if 
		return (point.x.between(rect.x1, rect.x2) && point.y.between(rect.y1, rect.y2)) 
		// {
		// 	return true
		// } else {
		// 	return false
		// }
	},

	//* https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
	circleIntersectsRect(circle, rect) { // Takes circle object with x, y, and r + rect with x, y, w, and h

		// Circle coords are centered, rect coords are top left corner:
		const distX = p5.abs(circle.x - rect.x - rect.w / 2)
		const distY = p5.abs(circle.y - rect.y - rect.h / 2)

		if (distX > (rect.w / 2 + circle.r) || distY > (rect.h / 2 + circle.r)) return false

		if (distX <= (rect.w / 2) || distY <= (rect.h / 2)) return true

		const dx = distX - rect.w / 2
		const dy = distY - rect.h / 2

		return (dx * dx + dy * dy <= circle.r * circle.r)
	},

	circleIntersectsEdge(circle) {
		const wallHalfWidth = config().wall.strokeWidth / 2

		// if
		return (circle.x - circle.r <= wallHalfWidth || circle.x + circle.r >= p5.width - wallHalfWidth || circle.y - circle.r <= wallHalfWidth || circle.y + circle.r >= p5.height - wallHalfWidth) 
		// {
		// 	return true
		// } else {
		// 	return false
		// }
	},

	// Returns a rectangle representation of a wall-object for different types of intersection checks:
	getWallRect(wall, circle = false) {
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
	},

	outOfBounds(point) {
		const wallHalfWidth = config().wall.strokeWidth / 2

		const out = {
			x: false,
			y: false
		}

		if (point.x <= wallHalfWidth || point.x >= p5.width - wallHalfWidth) {
			out.x = true
		}

		if (point.y <= wallHalfWidth || point.y >= p5.height - wallHalfWidth) {
			out.y = true
		}

		return out
	},

	pointCloseToTank(point) {
		for (const tank of gameState().tanks) {
			if (p5.dist(point.x, point.y, tank.x, tank.y) <= config().cell.width * config().tank.spawnDistance) {
				return true
			}

			continue
		}
	},

	randomSpawnCoords() {
		// Random cell:
		const col = p5.floor(p5.random(0, config().cell.xAmt))
		const row = p5.floor(p5.random(0, config().cell.yAmt))
		const cell = getCell(col, row)

		// Midpoint of cell:
		const x = cell.x + cell.w / 2
		const y = cell.y + cell.w / 2

		return { x: x, y: y, col: col, row: row }
	},

	// Returns a random tank from state.tanks, an array (or single number) of excluded indices being optional:
	randomTank(exclude = null) {

		// Copies tanks array:
		const tanks = [...gameState().tanks]

		if (exclude !== null) { // Has to check against null, since index 0 is also falsy

			// Removes any exclusions from clone:
			if (typeof exclude === 'number') { // Can use both single index (faster), or array of exclusions
				tanks.splice(exclude, 1)
			} else {
				for (let i = exclude.length - 1; i >= 0; i--) { //! Not sure if this works as intended
					const index = exclude[i]
					tanks.splice(index, 1)
				}
			}
		}

		// Returns random tank from remainder (or undefined if none are left):
		return p5.random(tanks)
	},
}

// Every number can call .between:
Number.prototype.between = function (min, max, include = true) { // Cannot be arrow function because of 'this'-binding
	if (include) {
		return this <= max && this >= min
	} else {
		return this < max && this > min
	}
}

// Capitalize string to call a class constructor:
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

export const {
	getOffsetPoint,
	getDirection,
	getTurnDirection,
	randomColor,
	getCell,
	getCellIndices,
	removeWall,
	getUnvisitedNeighbors,
	// getColorButtonVal,
	pointInRect,
	circleIntersectsRect,
	circleIntersectsEdge,
	getWallRect,
	outOfBounds,
	pointCloseToTank,
	randomSpawnCoords,
	randomTank,
} = helpers