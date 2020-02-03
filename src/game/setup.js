//import Cell from './Cell.js'

// import store from '@/store'
// const p5 = store.state.p5
// const config = store.state.config

export default {
	methods: {
		setup() {
			this.p5.noLoop()
			this.p5.noCursor()

			this.p5.frameRate(this.$store.state.config.fps)
			const canvasWidth = this.$store.state.config.cell.width * this.$store.state.config.cell.xAmt
			const canvasHeight = this.$store.state.config.cell.width * this.$store.state.config.cell.yAmt
			this.p5.createCanvas(canvasWidth, canvasHeight)

			// Is overwritten in Game.start(), but makes a nice background to the start menu:
			// Cell.generateGrid()
			// Cell.populateWalls()
			// Cell.generateMaze()

			this.p5.imageMode(this.p5.CENTER)
			this.p5.angleMode(this.p5.DEGREES)
		}
	}
}

