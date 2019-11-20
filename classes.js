class Tank {
	constructor(name, x, y, forward = 'ArrowUp', right = 'ArrowRight', backward = 'ArrowDown', left = 'ArrowLeft', fire = 'Space') {
		this.name = name;
		this.x = x;
		this.y = y;
		this.d = config.player.diameter;
		this.speed = config.player.moveSpeed;
		this.turnSpeed = config.player.turnSpeed;
		this.color = [30, 170, 30]; // random?
		this.orientation = Math.floor(Math.random() * 360);
		this.keybindings = {
			forward: forward,
			backward: backward,
			left: left,
			right: right
		}
	}

	show() {
		stroke(51)
		// Color of tank
		fill(...this.color)
		// Body of tank
		strokeWeight(1)
		circle(this.x, this.y, this.d)
		// Orientation of cannon
		const cannonXStart = (this.d / 5) * Math.cos(this.orientation) + this.x
		const cannonYStart = (this.d / 5) * Math.sin(this.orientation) + this.y
		const cannonXEnd = config.player.cannonLength * Math.cos(this.orientation) + this.x
		const cannonYEnd = config.player.cannonLength * Math.sin(this.orientation) + this.y
		// Outline of cannon
		strokeWeight(3)
		// Cannon
		line(cannonXStart, cannonYStart, cannonXEnd, cannonYEnd)
	}

	move() {
		// Angle and amount to move
		const x = this.speed * Math.cos(this.orientation)
		const y = this.speed * Math.sin(this.orientation)

		// Checking for keypresses
		if (state.pressedKeys[this.keybindings.forward]) {
			this.x += x
			this.y += y
		}
		if (state.pressedKeys[this.keybindings.backward]) {
			this.x -= x
			this.y -= y
		}
		if (state.pressedKeys[this.keybindings.left]) {
			this.orientation -= this.turnSpeed
		}
		if (state.pressedKeys[this.keybindings.right]) {
			this.orientation += this.turnSpeed
		}
	}
}

class Cell {
	constructor(x, y) {

	}
}

class Wall {
	constructor(cellX, cellY, direction) {

	}

	show() {
		line()
	}
}