import store from '@/store'
const { p5 } = store.state
const { config } = store.getters

import Wall from './Wall.js'


class Cell {
	constructor(x, y, ix, iy) { // Coords + indices in the grid
		this.x = x
		this.y = y
		this.ix = ix
		this.iy = iy
		this.w = config().cell.width
		// Makes a wall at chance, if wall is not on canvas edge:
		this.walls = {} // Walls are set randomly
			// right: null,
			// bottom: null
		
		// For creating the maze:
		this.visited = false
		// For accessing neighbors fast (is set after all cells are made, since "future" cells will be referenced):
		this.neighborhood = [this]
	}

	get midpoint() {
		return {
			x: this.x + this.w / 2,
			y: this.y + this.w / 2
		}
	}

	randomWall(side) {
		return p5.random() < config().wall.occurrenceRate ? new Wall(this, side) : null
	}
}

export default Cell