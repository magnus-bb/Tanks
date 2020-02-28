import Cell from './Cell.js'
import { getCell } from './helpers.js'

import store from '@/store'
const { p5, setup } = store.state
const { config, gameState } = store.getters

const grid = {

	generate() {
		for (let x = 0; x < p5.width; x += config().cell.width) { // Uses width / height of canvas (based off amt of cells and cellwidth) to generate rows and columns of cells
			const column = []

			for (let y = 0; y < p5.height; y += config().cell.width) {
				column.push(new Cell(x, y))
			}

			store.commit('addGridColumn', column)
		}
	},

	// Goes through all cells and randomly populates walls
	populateWalls() {
		for (const col of gameState().grid) {
			for (const cell of col) {

				if (cell.x !== p5.width - config().cell.width) {
					cell.walls.right = cell.randomWall('right')
				}
				if (cell.y !== p5.height - config().cell.width) {
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

			const unvisitedCells = this._getUnvisitedNeighbors(currentCell)
			if (unvisitedCells.length > 0) {
				store.commit('pushSetupCell', currentCell)
				// this.setup.cellStack.push(currentCell)

				const data = p5.random(unvisitedCells)
				const nextCell = data.cell
				const dir = data.dir

				this._removeWall(currentCell, nextCell, dir)
				nextCell.visited = true
				store.commit('pushSetupCell', nextCell)
				// this.setup.cellStack.push(nextCell)
			}
		}
	},

	// Returns col and row num of cell:
	_getCellIndices(cell) {
		for (let colNum = 0; colNum < gameState().grid.length; colNum++) {
			const col = gameState().grid[colNum]
			for (let rowNum = 0; rowNum < col.length; rowNum++) {
				if (gameState().grid[colNum][rowNum] === cell) return [colNum, rowNum]
			}
		}
	},

	// Returns array of unvisited cells around given cell and their direction from the given cell:
	_getUnvisitedNeighbors(currentCell) {
		const indices = this._getCellIndices(currentCell)
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

	_removeWall(fromCell, toCell, dir) {
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
}

export default grid