class Tank {
	constructor(name, color, x, y, controls) {
		this.name = name
		this.x = x
		this.y = y //TODO: Given a cell, calculate the center instead of giving a center coordinate
		this.d = config.tank.diameter
		this.moveSpeed = config.tank.moveSpeed
		this.turnSpeed = config.tank.turnSpeed
		this.drive = false // To look ahead before actually moving
		this.direction = random(0, 360)
		this.color = color // Array of RGB
		this.ammo = config.tank.ammo
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }] //? For death recap - maybe
		this.controls = controls
		this.moveCoords = {
			dX: 0,
			dY: 0
		}

		/* Used to check if the tank is turning in a frame, to be able to "bounce" back, if there is a turn collision.
		It is not possible to just annull the turning, since the new coords have to be present when checking for tank collisions */
		this.turning = 0

		const relCannonRoot = getMoveCoords(this.d / config.tank.cannon.midOffsetFraction, this.direction, 'forward')
		const relCannonTip = getMoveCoords(config.tank.cannon.length, this.direction, 'forward')
		this.relCannon = {
			root: {
				x: relCannonRoot.x,
				y: relCannonRoot.y
			},
			tip: {
				x: relCannonTip.x,
				y: relCannonTip.y
			},
		}
	}

	//* INSTANCE METHODS

	get cannon() {
		return {
			root: {
				x: this.relCannon.root.x + this.x,
				y: this.relCannon.root.y + this.y
			},
			tip: {
				x: this.relCannon.tip.x + this.x,
				y: this.relCannon.tip.y + this.y
			}
		}
	}

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
		this.turning = 0 // Resets
		if (keyIsDown(this.controls.left)) {
			this.turn(-1)
			this.turning = -1
		}
		if (keyIsDown(this.controls.right)) {
			this.turn(1)
			this.turning = 1
		}

		// Angle and amount (if any) to move:
		const move = getMoveCoords(this.moveSpeed, this.direction, this.drive)
		this.moveCoords.dX = move.x
		this.moveCoords.dY = move.y
	}

	// Takes -1 for left and 1 for right:
	turn(direction, bodyCollision = false) {
		if (bodyCollision) {
			// % 360 makes it so we don't have to deal with angles over 360 deg:
			this.direction = (this.direction % 360) + this.turnSpeed / config.tank.collisionTurnFraction * direction //TODO: Maybe use rotate() when we switch to sprites
		} else {
			this.direction = (this.direction % 360) + this.turnSpeed * direction //TODO: Maybe use rotate() when we switch to sprites
		}
	}

	// Both wall and edge collisions
	checkCollision(wall = null) {

		//TODO: Include cannon tip, lav helpers først, ellers er det umuligt
		//TODO: ABSTRAHER TIL HELPER SJIOT
		//TODO: Make it like a circle, not a square


		const wallWidth = config.env.wallStroke / 2 // +/- from center of wall

		// Next tank position (if no collision is observed):
		const lookAhead = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		const rad = this.d / 2

		const collision = {
			x: false,
			y: false
		}

		// Only wall collisions:
		if (wall) {

			// Which side of the wall is the long side and which is the end:
			if (wall.x1 === wall.x2) {
				var longAxis = 'y'
				var shortAxis = 'x'
			} else {
				var longAxis = 'x'
				var shortAxis = 'y'
			}

			// Gets the pseudo width of the line, to be able to check if a point is inside the "rectangle":
			const shortAxisPointOne = wall[shortAxis + '1'] - wallWidth
			const shortAxisPointTwo = wall[shortAxis + '1'] + wallWidth
			// Cannon body:
			if (((lookAhead[longAxis] + rad).between(wall[longAxis + '1'], wall[longAxis + '2']) || (lookAhead[longAxis] - rad).between(wall[longAxis + '1'], wall[longAxis + '2']))
				&&
				(shortAxisPointOne.between(this[shortAxis] - rad, this[shortAxis] + rad) || shortAxisPointTwo.between(this[shortAxis] - rad, this[shortAxis] + rad))
				|| // Cannon tip:
				(lookAhead[longAxis] + this.relCannon.tip[longAxis]).between(wall[longAxis + '1'], wall[longAxis + '2'])
				&&
				(this[shortAxis] + this.relCannon.tip[shortAxis]).between(shortAxisPointOne, shortAxisPointTwo)
			) {

				collision[longAxis] = true
				//return longAxis
			}
			// Cannon body:
			if (((this[longAxis] - rad).between(wall[longAxis + '1'], wall[longAxis + '2']) || (this[longAxis] + rad).between(wall[longAxis + '1'], wall[longAxis + '2']))
				&&
				(shortAxisPointOne.between(lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad) || shortAxisPointTwo.between(lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad))
				||
				(this[longAxis] + this.relCannon.tip[longAxis]).between(wall[longAxis + '1'], wall[longAxis + '2'])
				&&
				(lookAhead[shortAxis] + this.relCannon.tip[shortAxis]).between(shortAxisPointOne, shortAxisPointTwo)) {

				collision[shortAxis] = true
				//return shortAxis
			}

			// Only edge collisions:
		} else {
			// Interaction with edges of convas:
			if (lookAhead.x - rad <= 0 + wallWidth || lookAhead.x + rad >= width - wallWidth) {
				collision.x = true
			}
			if (lookAhead.y - rad <= 0 + wallWidth || lookAhead.y + rad >= height - wallWidth) {
				collision.y = true
			}
		}

		return collision
	}

	//? REMOVE SLOW IN ANY DIRECTION WHEN COLLIDING, JUST HAVE SLOW TURN ON CANNON COLLISION
	//? THIS WILL MAKE AXES DISAPPEAR FROM TANK COLLISIONS AND MAKE FEWER GLITCES WITH WALLS
	handleCollision(axes) {
		// For accessing dX or dY prop of moveCoords:
		for (const axis in axes) {

			if (axes[axis]) {
				const deltaAxis = 'd' + axis.toUpperCase()

				// For slowing movement of the tank
				const otherDeltaAxis = axis === 'x' ? 'dY' : 'dX'

				// No crossing walls:
				this.moveCoords[deltaAxis] = 0

				// Slowing movement:
				this.moveCoords[otherDeltaAxis] /= config.tank.collisionSlowFactor

				// Turns slowly, if driving forward:
				if (this.drive === 'forward') {
					//TODO: ONLY WITH CANNON COLLISION
					this.turn(getTurnDirection(axis, this.direction), true) // true lowers the turnspeed for collisions
				}
			}
		}
	}

	checkTurnCollision(wall = null, side = null) {
		// Starts from edge of tank, not cannon root:
		for (let i = this.d / 2; i <= config.tank.cannon.length; i++) {
			// Every point on the cannon...
			const point = getMoveCoords(i, this.direction, 'forward')
			// Relative to the tank:
			point.x += this.x
			point.y += this.y

			const wallWidth = config.env.wallStroke / 2 // +/- from center of wall

			// Only wall collisions:
			if (wall && side) {
				// Which side of the wall is the long side and which is the end:
				const longAxis = side === 'right' ? 'y' : 'x' // Hack to help add wallWidth when needed and vice versa
				const shortAxis = side === 'bottom' ? 'y' : 'x'

				// Gets the pseudo width of the line, to be able to check if a point is inside the "rectangle":
				const shortAxisPointOne = wall[shortAxis + '1'] - wallWidth
				const shortAxisPointTwo = wall[shortAxis + '1'] + wallWidth

				if (point[longAxis].between(wall[longAxis + '1'], wall[longAxis + '2']) && point[shortAxis].between(shortAxisPointOne, shortAxisPointTwo)) {
					return true
				}

			} else {

				// Interaction with edges of convas:
				if (point.x <= 0 + wallWidth || point.x >= width - wallWidth || point.y <= 0 + wallWidth || point.y >= height - wallWidth) {
					return true
				}
			}
		}
	}

	handleTurnCollision() {
		this.turn(this.turning * -1) // Turn back (effectively annulling a turn made in input)
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
		const root = getMoveCoords(this.d / config.tank.cannon.midOffsetFraction, this.direction, 'forward') // Same function as with moving - gets coords based on distance from center and a direction
		const tip = getMoveCoords(config.tank.cannon.length, this.direction, 'forward') // Same function as with moving - gets coords based on distance from center and a direction
		this.relCannon.root.x = root.x
		this.relCannon.root.y = root.y
		this.relCannon.tip.x = tip.x
		this.relCannon.tip.y = tip.y

		// Renders cannon:
		strokeWeight(config.tank.cannon.width)
		line(this.cannon.root.x, this.cannon.root.y, this.cannon.tip.x, this.cannon.tip.y)
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