import store from '@/store'
const { p5 } = store.state
const { config } = store.getters

export default class Wall {
	constructor(owner, side) {
		this.owner = owner
		this.side = side
		this.x1 = owner.x
		this.y1 = owner.y
		this.x2 = owner.x
		this.y2 = owner.y
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
	}

	destroy() {
		this.owner.walls[this.side] = null
	}

	_show() {
		p5.push()

		p5.strokeWeight(this.w)
		p5.strokeCap(p5.ROUND)
		p5.stroke(config().wall.color)
		p5.line(this.x1, this.y1, this.x2, this.y2)

		p5.pop()
	}

	onFrame() {
		this._show()
	}
}