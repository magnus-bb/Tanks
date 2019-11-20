//! Player
class Tank {
	constructor(name, x, y, forward = 'ArrowUp', right = 'ArrowRight', backward = 'ArrowDown', left = 'ArrowLeft', fire = 'Space') {
		this.name = name
		this.x = x
		this.y = y
		this.d = config.player.diameter
		this.moveSpeed = config.player.moveSpeed
		this.turnSpeed = config.player.turnSpeed
		this.color = randomColor()
		this.orientation = 0
		this.keybindings = {
			forward: forward,
			backward: backward,
			left: left,
			right: right,
			fire: fire
		},
			this.ammo = config.player.ammo
		this.weapon = null
	}

	move() {
		// Angle and amount to move
		const move = moveInDir(this.moveSpeed, this.orientation)

		// Controls-handling
		if (state.pressedKeys[this.keybindings.forward]) {
			this.x += move.x
			this.y += move.y
		}
		if (state.pressedKeys[this.keybindings.backward]) {
			this.x -= move.x
			this.y -= move.y
		}
		if (state.pressedKeys[this.keybindings.left]) {
			this.orientation -= this.turnSpeed
		}
		if (state.pressedKeys[this.keybindings.right]) {
			this.orientation += this.turnSpeed
		}
	}

	fire() {
		if (this.weapon) {
			// Use weapon
		} else if (this.ammo > 0) {
			this.ammo--
			state.projectiles.push(new Bullet(this))
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
}

class Bullet {
	constructor(owner) {
		this.d = config.bullet.diameter
		this.direction = owner.orientation
		this.speed = config.bullet.speed
		this.owner = owner

		this.x = (owner.d / 2 + this.d / 2 + 1) * Math.cos(this.direction) + owner.x
		this.y = (owner.d / 2 + this.d / 2 + 1) * Math.sin(this.direction) + owner.y
	}

	move() {
		const move = moveInDir(this.speed, this.direction)
		this.x += move.x
		this.y += move.y
	}

	show() {
		noStroke()
		fill(0)
		circle(this.x, this.y, this.d)
	}

	// Uses index number to splice from state array of projectiles
	destroy(index) {
		if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
			state.projectiles.splice(index, 1)
			this.owner.ammo++
		}
	}
}


//! Environment
class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.environment.cellWidth
		this.walls = {
			top: null,
			right: null,
			bottom: null,
			left: null
		}
	}

	populateWalls() {
		for (const wall in this.walls) {
			const setWall = Math.random() < config.environment.wallChance
			if (setWall) {
				this.walls[wall] = new Wall(this, wall)
			}
		}
	}
}

class Wall {
	constructor(owner, side) {
		this.x1 = owner.x
		this.y1 = owner.y
		this.x2 = owner.x
		this.y2 = owner.y
		this.w = config.environment.wallWidth

		const length = owner.w
		switch (side) {
			case 'top':
				this.x2 += length
				break
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
			case 'left':
				this.y2 += length
				break
		}
	}

	show() {
		strokeWeight(this.w)
		strokeCap(PROJECT)
		stroke(41)
		line(this.x1, this.y1, this.x2, this.y2)
	}
}








//! Helper functions
function moveInDir(speed, direction) {
	return {
		x: speed * Math.cos(direction),
		y: speed * Math.sin(direction)
	}
}

function randomColor() {
	return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

function randomWallSide() {
	const sides = ['top', 'right', 'bottom', 'left']
	const index = Math.floor(Math.random() * 4)
	return sides[index]
}