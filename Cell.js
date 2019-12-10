export default class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.env.cellWidth
		// Makes a wall at chance, if wall is not on canvas edge
		this.walls = {
			right: this.x !== width - config.env.cellWidth ? this.randomWall('right') : null,
			bottom: this.y !== height - config.env.cellWidth ? this.randomWall('bottom') : null
		}
		// For creating the maze:
		this.visited = false
	}

	randomWall(side) {
		return random() < config.env.wallOccurrence ? new Wall(this, side) : null
	}
}