class Wall {
	constructor(owner, side) {
		this.x1 = owner.x
		this.y1 = owner.y
		this.x2 = owner.x
		this.y2 = owner.y
		this.w = Config.current.wall.strokeWidth

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

	_show() {
		push()

		strokeWeight(this.w)
		strokeCap(ROUND)
		stroke(41)
		line(this.x1, this.y1, this.x2, this.y2)

		pop()
	}

	onFrame() {
		this._show()
	}
}