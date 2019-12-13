class Tank {
	constructor(name, x, y, forward = UP_ARROW, right = RIGHT_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, fire = 32) {
		this.name = name
		this.x = x
		this.y = y //TODO: Given a cell, calculate the center instead of giving a center coordinate
		this.d = config.player.diameter
		this.moveSpeed = config.player.moveSpeed
		this.turnSpeed = config.player.turnSpeed
		this.drive = false // To look ahead before actually moving
		this.direction = random(0, 360)
		this.color = randomColor()
		this.ammo = config.player.ammo
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }] //? For death recap - maybe
		this.keybindings = {
			forward: forward,
			backward: backward,
			left: left,
			right: right,
			fire: fire
		}
		this.moveCoords = {
			dX: 0,
			dY: 0
		}
		this.cannonTip = {
			x: config.player.cannonLength * cos(radians(this.direction)) + this.x,
			y: config.player.cannonLength * sin(radians(this.direction)) + this.y
		}
	}

	//* INSTANCE METHODS

	input() {
		// Forwards / backwards mobility
		if (keyIsDown(this.keybindings.forward)) {
			this.drive = 'forward'
		} else if (keyIsDown(this.keybindings.backward)) {
			this.drive = 'backward'
		} else {
			this.drive = false
		}

		// Turning
		if (keyIsDown(this.keybindings.left)) {
			this.turn(-1)
		}

		if (keyIsDown(this.keybindings.right)) {
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
			this.direction = (this.direction % 360) + this.turnSpeed / config.player.collisionTurnFactor * direction //TODO: Maybe use rotate() when we switch to sprites
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

		if (wall && side) { // Only wall collisions
			//TODO: Include cannon
			//TODO: Abstract this into helpers
			//TODO: Make it like a circle, not a square

			const rad = this.d / 2
			if ((between(lookAhead[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(lookAhead[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(shortAxisPointOne, this[shortAxis] - rad, this[shortAxis] + rad) || between(shortAxisPointTwo, this[shortAxis] - rad, this[shortAxis] + rad))) {
				this.handleCollision(longAxis)
			}
			if ((between(this[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(this[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(shortAxisPointOne, lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad) || between(shortAxisPointTwo, lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad))) {
				this.handleCollision(shortAxis)
			}
		} else { // Only edge collisions
			// Interaction with edges of convas:
			if (lookAhead.x <= 0 + wallWidth || lookAhead.x >= width - wallWidth) {
				this.handleCollision('x')
			}
			if (lookAhead.y <= 0 + wallWidth || lookAhead.y >= height - wallWidth) {
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
		this.moveCoords[otherDeltaAxis] /= config.player.collisionSlowFactor

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
		this.cannonTip.x = config.player.cannonLength * cos(radians(this.direction)) + this.x
		this.cannonTip.y = config.player.cannonLength * sin(radians(this.direction)) + this.y

		// Renders cannon:
		strokeWeight(3)
		line(cannonStartX, cannonStartY, this.cannonTip.x, this.cannonTip.y)
	}
}