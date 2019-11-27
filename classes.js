//* Player
class Tank {
	constructor(name, x, y, forward = UP_ARROW, right = RIGHT_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, fire = 32) {
		this.name = name
		this.x = x
		this.y = y
		this.d = config.player.diameter
		this.moveSpeed = config.player.moveSpeed
		this.turnSpeed = config.player.turnSpeed
		this.color = randomColor()
		this.direction = 0 //! in degrees - converted to radians for moving
		this.ammo = config.player.ammo
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }] // For death recap - maybe
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
			// % 360 makes it so we don't have to deal with angles over 360 deg
			this.direction = (this.direction % 360) - this.turnSpeed //! SEE IF ROTATE() CAN DO THIS
			//console.log(this.direction) //! DELETE
		}
		if (keyIsDown(this.keybindings.right)) {
			this.direction = (this.direction % 360) + this.turnSpeed //! SEE IF ROTATE() CAN DO THIS
			//console.log(this.direction) //! DELETE
		}

		// Trail only updates if tank is not standing still
		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
		}
	}

	fire() {
		if (this.weapon) {
			// Make class for each weapon?
			// Use weapon
		} else if (this.ammo > 0) {
			this.ammo--
			// Keeps track of all bullets
			state.projectiles.push(new Bullet(this))

			shake()
		}
	}

	show() {
		stroke(51)
		// Color of tank
		fill(...this.color)
		// Body of tank
		strokeWeight(1)
		circle(this.x, this.y, this.d)
		// direction of cannon + offset from center
		const cannonXStart = (this.d / 5) * cos(radians(this.direction)) + this.x //! SEE IF ROTATE() CAN DO THIS
		const cannonYStart = (this.d / 5) * sin(radians(this.direction)) + this.y
		const cannonXEnd = config.player.cannonLength * cos(radians(this.direction)) + this.x
		const cannonYEnd = config.player.cannonLength * sin(radians(this.direction)) + this.y
		// Cannon
		strokeWeight(3)
		line(cannonXStart, cannonYStart, cannonXEnd, cannonYEnd)
	}
}

//! Should be extension of a Projectile class, so other weapons can extend as well
class Bullet {
	constructor(owner) {
		// Initial size is bigger for a muzzle flash effect
		this.d = config.bullet.diameter * config.effects.muzzleSize
		// Moves in direction that owner was pointing:
		this.direction = owner.direction //! RECALCULATE DIRECTION AFTER EACH BOUNCE, SINCE BOUNCE JUST INVERTS COORDS
		this.speed = config.bullet.speed
		this.owner = owner
		// Starts offset from tank center:
		this.x = (owner.d / 2 + this.d / 2 + 1) * cos(radians(this.direction)) + owner.x //! ONLY NEEDS POINT AT THE TIP OF THE CANNON
		this.y = (owner.d / 2 + this.d / 2 + 1) * sin(radians(this.direction)) + owner.y //! ONLY NEEDS POINT AT THE TIP OF THE CANNON
		// First frame alive is used to fade projectile
		this.startFrame = frameCount

		// Direction only needs to be recalculated every bounce on projectiles and on spawn
		const move = getMoveCoords(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}

		// For effects
		this.tail = []
	}

	move() {
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	bounce(axis) {
		// Reverses move direction of the axis
		if (axis === 'x') {
			this.moveCoords.dX *= -1
		}
		if (axis === 'y') {
			this.moveCoords.dy *= -1
		}

		// Updates direction to match the new moveCoords
		this.direction = getDirection(this.moveCoords.dX, this.moveCoords.dY)
	}

	//! Does not check if ends of walls are hit
	//! https://happycoding.io/tutorials/processing/collision-detection - SEE RECT + RECT BUT WITH "RAYTRACING" per pixel of bullet movespeed between current pos and next pos
	checkCollision() {

		//! Change cells to be in a 2D array, so neighbouring cell walls can be checked
		for (const cell of state.cells) {
			for (const wall in cell.walls) {
				//* Lookahead on x and y if a wall (rect) is there, bounce next frame
			}
		}

		// 		// If the wall exists, check for a collision (with the placement of the wall):
		// 		if (cell.walls[wall]) {
		// 			const collision = this.checkCollision(cell.walls[wall]) // Returns axis of wall and direction of bullet
		// 			if (collision) {
		// 				if (this.direction < 0) this.direction += 360 // Normalizes angle to positive equivalent - 90deg === -270deg etc.
		// 				const axis = collision[0]
		// 				const direction = collision[1]

		// 				// The directions need to be positive for these hacks to work:
		// 				//! ONLY NEEDS TO CHECK IF DIRECTION X/Y ARE POSITIVE OR NEGATIVE
		// 				if (axis === 'vertical') {
		// 					if (direction === 'upwards') {
		// 						this.direction += (270 - this.direction) * 2
		// 					} else /*downwards*/ {
		// 						this.direction += (90 - this.direction) * 2
		// 					}
		// 				} else /*horizontal*/ {
		// 					if (direction === 'right') {
		// 						this.direction = (this.direction - 360) * -1
		// 					} else /*left*/ {
		// 						this.direction += (180 - this.direction) * 2
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }


		// const wallWidth = wall.w / 2 // Line thickness makes the walls a pseudo-rectangle that I can check for coordinates 'inside'

		// // If projectile is directly next to a wall and inside its 'pseudo'-rectangle:
		// if (between(this.y, wall.y1, wall.y2) && between(this.x, wall.x1 - wallWidth, wall.x1 + wallWidth)) {
		// 	// Checks for the relevant moving direction of projectile:
		// 	if (between(this.direction, -180, 0) || this.direction > 180) return ['vertical', 'upwards']
		// 	if (between(this.direction, 0, 180) || this.direction < -180) return ['vertical', 'downwards']
		// }
		// // If projectile is directly above/below to a wall and inside its 'pseudo'-rectangle:
		// if (between(this.x, wall.x1, wall.x2) && between(this.y, wall.y1 - wallWidth, wall.y1 + wallWidth)) {
		// 	// Checks for the relevant moving direction of projectile:
		// 	if (between(this.direction, -90, 90) || this.direction > 270 || this.direction < -270) return ['horizontal', 'right']
		// 	if (between(this.direction, -270, -90) || between(this.direction, 90, 270)) return ['horizontal', 'left']
		// }

		// // If no collissions
		// return null
	}

	// Makes a tail point for each frame
	effect(color) {
		// Makes tail data
		this.tail.push({ x: this.x, y: this.y })
		if (this.tail.length > 40) {
			this.tail.shift()
		}

		// Renders tail
		color.setAlpha(config.effects.bulletTrailAlpha)
		fill(color);
		for (let i = 0; i < this.tail.length; i++) {
			let d = this.d - ((this.tail.length - i) / 10) > 1 ? this.d - ((this.tail.length - i) / 10) : 1
			circle(this.tail[i].x, this.tail[i].y, d)
		}

		// Resizes bullet after muzzle flash
		if (this.d > config.bullet.diameter) {
			this.d -= 3
		} else {
			this.d = config.bullet.diameter
		}
	}

	show() {
		let ownerColor = color(this.owner.color) //! WILL CHANGE TO A SPRITE

		// Main bullet
		fill(ownerColor)
		noStroke()
		circle(this.x, this.y, this.d)

		this.effect(ownerColor)

		// Removes projectile after framesAlive has passed
		if (frameCount >= this.startFrame + config.bullet.framesAlive) {
			const projectileIndex = state.projectiles.findIndex(proj => proj === this)
			this.destroy(projectileIndex)
		}
	}

	// Uses index number to remove projectile from the game:
	destroy(index) {
		state.projectiles.splice(index, 1)
		this.owner.ammo++
	}
}

//* Environment
class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.environment.cellWidth
		this.walls = {
			right: null,
			bottom: null
		}
	}

	populateWalls() {
		for (const wall in this.walls) {
			const setWall = Math.random() < config.environment.wallOccurrency
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

	show() {
		strokeWeight(this.w)
		strokeCap(PROJECT)
		stroke(41)
		line(this.x1, this.y1, this.x2, this.y2)
	}
}