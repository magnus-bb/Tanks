// import store from '@/store'
// const p5 = store.state.p5
// const config = store.state.config
// const state = store.getters.getGameState
import store from '@/store'
const { state } = store
const { p5, config, setup } = state

import Wall from './Wall.js'
import { getCell, getUnvisitedNeighbors, removeWall } from './helpers.js'

class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.cell.width
		// Makes a wall at chance, if wall is not on canvas edge
		this.walls = {
			right: null,
			bottom: null
		}
		// For creating the maze:
		this.visited = false
	}

	get midpoint() {
		return {
			x: this.x + this.w / 2,
			y: this.y + this.w / 2
		}
	}

	randomWall(side) {
		return p5.random() < config.wall.occurrenceRate ? new Wall(this, side) : null
	}

}

export default {
	data() {
		return {
			setup: {
				//TODO: Static props from classes here
				cellStack: [] //TODO: Move out of vuex?
			},
		}
	},

	methods: {
		generateGrid() {
			for (let x = 0; x < p5.width; x += config.cell.width) { // Uses width / height of canvas (based off amt of cells and cellwidth) to generate rows and columns of cells
				const column = []

				for (let y = 0; y < p5.height; y += config.cell.width) {
					column.push(new Cell(x, y))
				}

				store.commit('addGridColumn', column)
			}
		},

		// Goes through all cells and randomly populates walls
		populateWalls() {
			for (const col of state.gameState.grid) {
				for (const cell of col) {

					if (cell.x !== p5.width - config.cell.width) {
						cell.walls.right = cell.randomWall('right') 
					}
					if (cell.y !== p5.height - config.cell.width) {
						cell.walls.bottom = cell.randomWall('bottom') 
					}
				}
			}
		},

		generateMaze() {
			// Starts maze generation: 
			const initialIndices = [0, 0] // Starting point does not matter
			const initialCell = getCell(...initialIndices)

			initialCell.visited = true
			this.setup.cellStack.push(initialCell)

			while (this.setup.cellStack.length > 0) {
				const currentCell = this.setup.cellStack.pop()

				const unvisitedCells = getUnvisitedNeighbors(currentCell)
				if (unvisitedCells.length > 0) {
					this.setup.cellStack.push(currentCell)

					const data = p5.random(unvisitedCells)
					const nextCell = data.cell
					const dir = data.dir

					removeWall(currentCell, nextCell, dir)
					nextCell.visited = true
					this.setup.cellStack.push(nextCell)
				}
			}
		}
	}
}
		// class Cell {
		// 	constructor(x, y) {
		// 		this.x = x
		// 		this.y = y
		// 		this.w = config.cell.width
		// 		// Makes a wall at chance, if wall is not on canvas edge
		// 		this.walls = {
		// 			right: null,
		// 			bottom: null
		// 		}

		// 		// For creating the maze:
		// 		this.visited = false
		// 	}

		// 	//* SETUP PROPS

		// 	//static cellStack = []

		// 	//* INSTANCE METHODS

		// 	randomWall(side) {
		// 		return random() < config.wall.occurrenceRate ? new Wall(this, side) : null
		// 	}

		// 	get midpoint() {
		// 		return {
		// 			x: this.x + this.w / 2,
		// 			y: this.y + this.w / 2
		// 		}
		// 	}

		// 	//* STATIC METHODS

		// 	// static resetGrid() {
		// 	// 	//state.grid = []

		// 	// 	// The grid has to be present for calculating starting positions of tanks before maze is generated:
		// 	// 	this.generateGrid()
		// 	// }