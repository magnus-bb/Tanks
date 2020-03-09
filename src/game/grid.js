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
				column.push(new Cell(x, y, gameState().grid.length, column.length))
			}

			store.commit('addGridColumn', column)
		}
	},

	setWallsAndNeighbors() {
		for (const col of gameState().grid) {
			for (const cell of col) {

				this._setWalls(cell)
				this._setNeighbors(cell)
			}
		}
	},

	// cell.neighborhood already includes itself:
	_setNeighbors(cell) {
		const col = cell.ix
		const row = cell.iy

		
		// Does not include bottom-right cell, since its walls are unimportant (too far away)
		if (getCell(col-1, row-1)) cell.neighborhood.push(getCell(col-1, row-1))
		if (getCell(col-1, row)) cell.neighborhood.push(getCell(col-1, row))
		if (getCell(col-1, row+1)) cell.neighborhood.push(getCell(col-1, row+1))
		if (getCell(col, row-1)) cell.neighborhood.push(getCell(col, row-1))
		if (getCell(col, row+1)) cell.neighborhood.push(getCell(col, row+1))
		if (getCell(col+1, row-1)) cell.neighborhood.push(getCell(col+1, row-1))
		if (getCell(col+1, row)) cell.neighborhood.push(getCell(col+1, row))
	},

	// Goes through all cells and randomly populates walls
	_setWalls(cell) {

		if (cell.x !== p5.width - config().cell.width) {
			const wall = cell.randomWall('right')

			if (wall) {
				cell.walls.right = wall
			}
		}
		if (cell.y !== p5.height - config().cell.width) {
			const wall = cell.randomWall('bottom')

			if (wall) {
				cell.walls.bottom = wall
			}
		}
	},

	generateMaze() {
		// Starts maze generation: 
		const initialIndices = [0, 0] // Starting point does not matter
		const initialCell = getCell(...initialIndices)

		initialCell.visited = true
		store.commit('pushSetupCell', initialCell)

		while (setup.cellStack.length > 0) {
			const currentCell = setup.cellStack[setup.cellStack.length - 1] // Store commits cannot return the popped cell
			store.commit('popSetupCell')

			const unvisitedCells = this._getUnvisitedNeighbors(currentCell)
			if (unvisitedCells.length > 0) {
				store.commit('pushSetupCell', currentCell)

				const data = p5.random(unvisitedCells)
				const nextCell = data.cell
				const dir = data.dir

				this._removeWall(currentCell, nextCell, dir)
				nextCell.visited = true
				store.commit('pushSetupCell', nextCell)
			}
		}
	},

	// // Returns col and row num of cell:
	// _getCellIndices(cell) {
	// 	for (let colNum = 0; colNum < gameState().grid.length; colNum++) {
	// 		const col = gameState().grid[colNum]
	// 		for (let rowNum = 0; rowNum < col.length; rowNum++) {
	// 			if (gameState().grid[colNum][rowNum] === cell) return [colNum, rowNum]
	// 		}
	// 	}
	// },

	// Returns array of unvisited cells around given cell and their direction from the given cell:
	_getUnvisitedNeighbors(currentCell) {
		const col = currentCell.ix
		const row = currentCell.iy

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
			delete toCell.walls.bottom// = null
		} else if (dir === 'right') {
			delete fromCell.walls.right// = null
		} else if (dir === 'down') {
			delete fromCell.walls.bottom// = null
		} else if (dir === 'left') {
			delete toCell.walls.right// = null
		}
	}
}

export default grid