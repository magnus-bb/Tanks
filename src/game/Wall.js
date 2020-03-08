import store from '@/store'
const { p5 } = store.state
const { config } = store.getters

export default class Wall {
	constructor(owner, side) {
		this.owner = owner
		this.side = side
		this.x1 = owner.x
		this.y1 = owner.y
		this.x2 = owner.x // Potentially changes
		this.y2 = owner.y // Potentially changes
		this.w = config().wall.strokeWidth

		const length = owner.w
		switch (side) {
			case 'right':
				this.x1 += length
				this.x2 += length
				this.y2 += length
				break
			case 'bottom':
				this.x2 += length
				this.y1 += length
				this.y2 += length
				break
		}

		// Quick access to the wall (drawn as a line), but as a rectangle:
		this.pointRect = getWallRect(this) // For checking if a point is inside
		this.circleRect = getWallRect(this, true) // For checking if a circle intersects with
	}

	destroy() {
		this.owner.walls[this.side] = null
	}

	_show() {
		p5.push()

		p5.strokeWeight(this.w)
		p5.strokeCap(p5.ROUND)
		p5.stroke(config().strokeColor)
		p5.line(this.x1, this.y1, this.x2, this.y2)

		p5.pop()
	}

	onFrame() {
		this._show()
	}
}

// Returns a rectangle representation of a wall-object for different types of intersection checks:
function getWallRect(wall, circle = false) { // Only used when initializing walls
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
