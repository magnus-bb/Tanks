//import Cell from './Cell.js'

import store from '@/store'
const { p5 } = store.state
const { config } = store.getters

export default function setup() {
	p5.noLoop()
	p5.noCursor()

	p5.frameRate(config().fps)
	const canvasWidth = config().cell.width * config().cell.xAmt
	const canvasHeight = config().cell.width * config().cell.yAmt
	p5.createCanvas(canvasWidth, canvasHeight)

	// Is overwritten in Game.start(), but makes a nice background to the start menu:
	// Cell.generateGrid()
	// Cell.populateWalls()
	// Cell.generateMaze()

	p5.imageMode(p5.CENTER)
	p5.angleMode(p5.DEGREES)
}
