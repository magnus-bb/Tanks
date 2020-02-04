import Cell from './Cell.js'
import store from '@/store'
const { state } = store
const { p5, config, setup } = state
import { getCell, getUnvisitedNeighbors, removeWall } from './helpers.js'

const grid = {
	generate() {
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
		// setup.cellStack.push(initialCell)
		store.commit('pushSetupCell', initialCell)

		while (setup.cellStack.length > 0) {
			const currentCell = setup.cellStack[setup.cellStack.length - 1] // Store commits cannot return the popped cell
			store.commit('popSetupCell')
			// this.setup.cellStack.pop()

			const unvisitedCells = getUnvisitedNeighbors(currentCell)
			if (unvisitedCells.length > 0) {
				store.commit('pushSetupCell', currentCell)
				// this.setup.cellStack.push(currentCell)

				const data = p5.random(unvisitedCells)
				const nextCell = data.cell
				const dir = data.dir

				removeWall(currentCell, nextCell, dir)
				nextCell.visited = true
				store.commit('pushSetupCell', nextCell)
				// this.setup.cellStack.push(nextCell)
			}
		}
	}
}

export default grid