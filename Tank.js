class Tank {
	constructor(name, x, y, controls) {
		this.name = name
		this.x = x
		this.y = y //TODO: Given a cell, calculate the center instead of giving a center coordinate
		this.d = config.tank.diameter
		this.moveSpeed = config.tank.moveSpeed
		this.turnSpeed = config.tank.turnSpeed
		this.drive = false // To look ahead before actually moving
		this.direction = random(0, 360)
		this.color = randomColor()
		this.ammo = config.tank.ammo
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }] //? For death recap - maybe
		this.controls = controls
		this.moveCoords = {
			dX: 0,
			dY: 0
		}
		this.cannonTip = {
			x: config.tank.cannonLength * cos(radians(this.direction)) + this.x,
			y: config.tank.cannonLength * sin(radians(this.direction)) + this.y
		}
	}

	//* INSTANCE METHODS

	input() {
		// Forwards / backwards mobility:
		if (keyIsDown(this.controls.forward)) {
			this.drive = 'forward'
		} else if (keyIsDown(this.controls.backward)) {
			this.drive = 'backward'
		} else {
			this.drive = false
		}

		// Turning:
		if (keyIsDown(this.controls.left)) {
			this.turn(-1)
		}
		if (keyIsDown(this.controls.right)) {
			this.turn(1)
		}

		// Angle and amount (if any) to move:
		const move = getMoveCoords(this.moveSpeed, this.direction, this.drive)
		this.moveCoords.dX = move.x
		this.moveCoords.dY = move.y
	}

	// Takes -1 for left and 1 for right:
	turn(direction, collision = false) {
		if (collision) {
			// % 360 makes it so we don't have to deal with angles over 360 deg:
			this.direction = (this.direction % 360) + this.turnSpeed / config.tank.collisionTurnFactor * direction //TODO: Maybe use rotate() when we switch to sprites
		} else {
			this.direction = (this.direction % 360) + this.turnSpeed * direction //TODO: Maybe use rotate() when we switch to sprites
		}
	}

	// Both wall and edge collisions
	checkCollision(wall = null, side = null) {
		const wallWidth = config.env.wallWidth / 2 // +/- from center of wall

		// Only wall collisions:
		if (wall && side) {
			// Which side of the wall is the long side and which is the end:
			var longAxis = side === 'right' ? 'y' : 'x' // Hack to help add wallWidth when needed and vice versa
			var shortAxis = side === 'bottom' ? 'y' : 'x'

			// Gets the pseudo width of the line, to be able to check if a point is inside the "rectangle":
			var shortAxisPointOne = wall[shortAxis + '1'] - wallWidth
			var shortAxisPointTwo = wall[shortAxis + '1'] + wallWidth
		}

		// Next tank position (if no collision is observed):
		const lookAhead = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		const rad = this.d / 2

		if (wall && side) { // Only wall collisions
			//TODO: Include cannon - probably in separate function, since turning is also affected
			//TODO: Abstract this into helpers
			//TODO: Make it like a circle, not a square

			if (((lookAhead[longAxis] + rad).between(wall[longAxis + '1'], wall[longAxis + '2']) || (lookAhead[longAxis] - rad).between(wall[longAxis + '1'], wall[longAxis + '2'])) && (shortAxisPointOne.between(this[shortAxis] - rad, this[shortAxis] + rad) || shortAxisPointTwo.between(this[shortAxis] - rad, this[shortAxis] + rad))) {
				this.handleCollision(longAxis)
			}
			if (((this[longAxis] - rad).between(wall[longAxis + '1'], wall[longAxis + '2']) || (this[longAxis] + rad).between(wall[longAxis + '1'], wall[longAxis + '2'])) && (shortAxisPointOne.between(lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad) || shortAxisPointTwo.between(lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad))) {
				this.handleCollision(shortAxis)
			}
		} else { // Only edge collisions
			// Interaction with edges of convas:
			if (lookAhead.x - rad <= 0 + wallWidth || lookAhead.x + rad >= width - wallWidth) {
				this.handleCollision('x')
			}
			if (lookAhead.y - rad <= 0 + wallWidth || lookAhead.y + rad >= height - wallWidth) {
				this.handleCollision('y')
			}
		}


		//? Old versions of wall collisions (for troubleshooting)
		// // Interaction with walls:
		// if ((between(lookAhead[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(lookAhead[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(this[shortAxis] + rad, shortAxisPointOne, shortAxisPointTwo) || between(this[shortAxis] - rad, shortAxisPointOne, shortAxisPointTwo))) {
		// 	this.handleCollision(longAxis)
		// }
		// if ((between(this[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(this[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(lookAhead[shortAxis] + rad, shortAxisPointOne, shortAxisPointTwo) || between(lookAhead[shortAxis] - rad, shortAxisPointOne, shortAxisPointTwo))) {
		// 	this.handleCollision(shortAxis)
		// }

		// // Interaction with walls:
		// if (between(lookAhead[longAxis], wall[longAxis + '1'], wall[longAxis + '2']) && between(this[shortAxis], shortAxisPointOne, shortAxisPointTwo)) {
		// 	this.handleCollision(longAxis)
		// }
		// if (between(this[longAxis], wall[longAxis + '1'], wall[longAxis + '2']) && between(lookAhead[shortAxis], shortAxisPointOne, shortAxisPointTwo)) {
		// 	this.handleCollision(shortAxis)
		// }
	}

	handleCollision(axis) {
		// For accessing dX or dY prop of moveCoords:
		const deltaAxis = 'd' + axis.toUpperCase()

		// For slowing movement of the tank
		const otherDeltaAxis = axis === 'x' ? 'dY' : 'dX'

		// No crossing walls:
		this.moveCoords[deltaAxis] = 0

		// Slowing movement:
		this.moveCoords[otherDeltaAxis] /= config.tank.collisionSlowFactor

		// Turning
		this.turn(getTurnDirection(axis, this.direction), true) // true lowers the turnspeed for collisions
	}

	move() {
		// Takes collisions into consideration, since moveCoords will be updated accordingly
		if (this.drive) {
			this.x += this.moveCoords.dX
			this.y += this.moveCoords.dY
		}

		// Trail only updates if tank is not standing still:
		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
		}
	}

	fire() {
		if (this.weapon) {
			//TODO: Use weapon
		} else if (this.ammo > 0) {
			this.ammo--
			state.projectiles.bullets.push(new Bullet(this))

			shake() // Global effect
		}
	}

	show() {

		stroke(51)
		fill(this.color)

		// Renders body:
		strokeWeight(1)
		circle(this.x, this.y, this.d)

		// Updates cannon position:
		const cannonStartX = (this.d / 5) * cos(radians(this.direction)) + this.x
		const cannonStartY = (this.d / 5) * sin(radians(this.direction)) + this.y
		this.cannonTip.x = config.tank.cannonLength * cos(radians(this.direction)) + this.x
		this.cannonTip.y = config.tank.cannonLength * sin(radians(this.direction)) + this.y

		// Renders cannon:
		strokeWeight(3)
		line(cannonStartX, cannonStartY, this.cannonTip.x, this.cannonTip.y)
	}

	// Uses index number to remove tank from the game:
	destroy(index) {
		state.tanks.splice(index, 1)
		//TODO: Msg on death or counter etc + effect
	}

	//* STATIC METHODS

	static checkHit(bullet, bulletIndex, tank, tankIndex) {
		// Distance between center of tank and bullet:
		const distance = dist(bullet.x, bullet.y, tank.x, tank.y)

		// Checks if distance is smaller, when width of tank and bullet have been factored in:
		if (distance < config.bullet.diameter / 2 + tank.d / 2) { // Does not use bullet.d, since the muzzle effect changes that size
			bullet.destroy(bulletIndex)
			tank.destroy(tankIndex)

			//TODO: let bullet.owner know it gets a point
		}
	}
}