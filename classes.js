//! Player
class Tank {
	constructor(name, x, y, forward = UP_ARROW, right = RIGHT_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, fire = 32) {
		this.name = name
		this.x = x
		this.y = y
		this.d = config.player.diameter
		this.moveSpeed = config.player.moveSpeed
		this.turnSpeed = config.player.turnSpeed
		this.color = randomColor()
		this.direction = 0
		this.ammo = config.player.ammo
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }]
		this.keybindings = {
			forward: forward,
			backward: backward,
			left: left,
			right: right,
			fire: fire
		}
	}

	move() {
		// Angle and amount to move
		const move = getMoveCoords(this.moveSpeed, this.direction)

		// Controls-handling
		if (keyIsDown(this.keybindings.forward)) {
			this.x += move.x
			this.y += move.y
		}
		if (keyIsDown(this.keybindings.backward)) {
			this.x -= move.x
			this.y -= move.y
		}
		if (keyIsDown(this.keybindings.left)) {
			this.direction = (this.direction % 360) - this.turnSpeed
			//console.log(this.direction) //! DELETE
		}
		if (keyIsDown(this.keybindings.right)) {
			this.direction = (this.direction % 360) + this.turnSpeed
			//console.log(this.direction) //! DELETE
		}

		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
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
		// direction of cannon
		const cannonXStart = (this.d / 5) * Math.cos(degsToRads(this.direction)) + this.x
		const cannonYStart = (this.d / 5) * Math.sin(degsToRads(this.direction)) + this.y
		const cannonXEnd = config.player.cannonLength * Math.cos(degsToRads(this.direction)) + this.x
		const cannonYEnd = config.player.cannonLength * Math.sin(degsToRads(this.direction)) + this.y
		// Outline of cannon
		strokeWeight(3)
		// Cannon
		line(cannonXStart, cannonYStart, cannonXEnd, cannonYEnd)
	}
}

class Bullet {
	constructor(owner) {
		this.d = config.bullet.diameter
		this.direction = owner.direction
		this.speed = config.bullet.speed
		this.owner = owner
		this.x = (owner.d / 2 + this.d / 2 + 1) * Math.cos(degsToRads(this.direction)) + owner.x
		this.y = (owner.d / 2 + this.d / 2 + 1) * Math.sin(degsToRads(this.direction)) + owner.y
	}

	move() {
		const move = getMoveCoords(this.speed, this.direction)
		this.x += move.x
		this.y += move.y
	}

	bounce() {
		for (const cell of state.cells) {
			// only looks at walls in the given cell
			if (between(this.x, cell.x, cell.x + cell.w, true) && between(this.y, cell.y, cell.y + cell.w, true)) {
				for (const wall in cell.walls) {
					// If the wall exists, check for a collision (with the placement of the wall)
					if (cell.walls[wall]) {
						const collision = this.checkCollision(wall, cell.walls[wall])
						if (collision) console.log(collision)
					}
				}
				break
			}
		}
	}

	//! Does not check if ends of walls are hit
	checkCollision(placement, wall) {
		const wallWidth = wall.w / 2

		if (placement === 'right' && (between(this.direction, -90, 90) || this.direction > 270 || this.direction < -270) && this.x >= wall.x1 - wallWidth) return placement
		if (placement === 'left' && (between(this.direction, -270, -90) || between(this.direction, 90, 270)) && this.x <= wall.x1 + wallWidth) return placement
		if (placement === 'top' && (between(this.direction, 0, -180) || this.direction > 180) && this.y <= wall.y1 + wallWidth) return placement
		if (placement === 'bottom' && (between(this.direction, 0, 180) || this.direction < -180) && this.y >= wall.y1 - wallWidth) return placement
		else return null
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
function getMoveCoords(speed, direction) {
	return {
		x: speed * Math.cos(degsToRads(direction)),
		y: speed * Math.sin(degsToRads(direction))
	}
}

function degsToRads(deg) {
	return deg * (PI / 180)
}

function randomColor() {
	return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

function randomWallSide() {
	const sides = ['top', 'right', 'bottom', 'left']
	const index = Math.floor(Math.random() * 4)
	return sides[index]
}

function between(number, min, max, forCell = false) { // Does not include max, since collisions will ping for several cells
	if (forCell) {
		return number < max && number >= min
	} else {
		return number < max && number > min
	}

}