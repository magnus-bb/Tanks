import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters

// Converts a direction and speed to new coords:
export function getOffsetPoint(dist, dir, moving = 'forward') { // Defaults to 'forward' since it is used for more than just moving objects
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
}

// export function randomColor(alpha = null) {
// 	return p5.color(p5.floor(p5.random(256)), p5.floor(p5.random(256)), p5.floor(p5.random(256), alpha || 255 /*? alpha : 255*/))
// }

// Returns reference to cell:
export function getCell(col, row) {
	if (gameState().grid[col] && gameState().grid[col][row]) {
		return gameState().grid[col][row]
	}
}

// Returns the cell that a given point is inside:
export function getContainingCell(point) {
	const col = Math.floor(point.x / p5.width * config().cell.xAmt)
	const row = Math.floor(point.y / p5.height * config().cell.yAmt)

	return gameState().grid[col][row]
}

// Takes a point and a rect-object and returns true if the point exists inside the four points that make up a rectangle:
export function pointInRect(point, rect) {
	return (point.x.between(rect.x1, rect.x2) && point.y.between(rect.y1, rect.y2))
}

//* https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
export function circleIntersectsRect(circle, rect) { // Takes circle object with x, y, and r + rect with x, y, w, and h

	// Circle coords are centered, rect coords are top left corner:
	const distX = p5.abs(circle.x - rect.x - rect.w / 2)
	const distY = p5.abs(circle.y - rect.y - rect.h / 2)

	if (distX > (rect.w / 2 + circle.r) || distY > (rect.h / 2 + circle.r)) return false

	if (distX <= (rect.w / 2) || distY <= (rect.h / 2)) return true

	const dx = distX - rect.w / 2
	const dy = distY - rect.h / 2

	return (dx * dx + dy * dy <= circle.r * circle.r)
}

export function circleIntersectsEdge(circle) { //TODO: Brug til Bullet
	const wallHalfWidth = config().wall.strokeWidth / 2

	return (circle.x - circle.r <= wallHalfWidth || circle.x + circle.r >= p5.width - wallHalfWidth || circle.y - circle.r <= wallHalfWidth || circle.y + circle.r >= p5.height - wallHalfWidth)
}

export function outOfBounds(point) {
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
}

export function randomCoords() {
	// Random cell:
	const col = p5.floor(p5.random(0, config().cell.xAmt))
	const row = p5.floor(p5.random(0, config().cell.yAmt))
	const cell = getCell(col, row)

	// Midpoint of cell:
	const x = cell.x + cell.w / 2
	const y = cell.y + cell.w / 2

	return { x: x, y: y, col: col, row: row }
}

// Takes an object with a speed and a position, and returns array of steps between the position and next position based off speed and wall-thickness:
export function stepArray({ x, y, moveCoords, speed }) {
	const steps = []

	for (let step = 0; step <= speed; step += (speed < config().wall.collisionStepSize ? speed : config().wall.collisionStepSize)) { // Only does lookaheads if speed is more than walls' width

		// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
		steps.push({
			x: x + moveCoords.dX * (step / speed),
			y: y + moveCoords.dY * (step / speed)
		})
	}

	return steps





	for (let step = 0; step <= speed; step += (speed < config().wall.collisionStepSize ? speed : config().wall.collisionStepSize)) { // Only makes fractional lookaheads of speed if speed is more than walls' width

			// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
			next.push({
				x: x + move.x * (step / speed),
				y: y + move.y * (step / speed)
			})
		}
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