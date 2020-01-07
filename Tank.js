class Tank {
	constructor(name, color, x, y, controls, owner) {
		this.owner = owner
		this.name = name
		this.x = x
		this.y = y //TODO: Given a cell, calculate the center instead of giving a center coordinate
		this.d = config.tank.diameter
		this.moveSpeed = config.tank.moveSpeed
		this.turnSpeed = config.tank.turnSpeed
		this.driving = false // To look ahead before actually moving
		this.direction = random(0, 360)
		this.color = color // Array of RGB
		this.ammo = config.tank.ammo
		this.equipment = null
		this.trail = [{ x: this.x, y: this.y }] //? For death recap - maybe
		this.controls = controls
		this.moveCoords = {
			dX: 0,
			dY: 0
		}
		this.turning = 0

		const relCannonTip = getOffsetPoint(config.tank.cannon.length, this.direction)
		this.relCannon = {
			x: relCannonTip.x,
			y: relCannonTip.y
		}
	}
	get cannon() {
		return {
			x: this.relCannon.x + this.x,
			y: this.relCannon.y + this.y
		}
	}
	get next() { // Next tank (center) position (if no collision is observed):
		return {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}
	get r() {
		return this.d / 2
	}

	//* INSTANCE METHODS

	input() {
		// Forwards / backwards mobility:
		if (keyIsDown(this.controls.forward)) {
			this.driving = 'forward'
		} else if (keyIsDown(this.controls.backward)) {
			this.driving = 'backward'
		} else {
			this.driving = false
		}

		// Turning:
		this.turning = 0 // Resets
		if (keyIsDown(this.controls.left)) {
			this.turning = -1
		}
		if (keyIsDown(this.controls.right)) {
			this.turning = 1
		}

		// Angle and amount (if any) to move:
		const move = getOffsetPoint(this.moveSpeed, this.direction, this.driving)
		this.moveCoords.dX = move.x
		this.moveCoords.dY = move.y
	}

	// Checks both wall and edge collisions:
	checkBodyCollision(wall = null) { // Defaults to check edge-collisions
		const collision = {
			x: false,
			y: false
		}

		const bodyX = {
			x: this.next.x,
			y: this.y,
			r: this.r
		}
		const bodyY = {
			x: this.x,
			y: this.next.y,
			r: this.r
		}

		if (wall) {
			const wallRect = getWallRect(wall, true)

			// Checks with a lookahead on x:
			if (circleIntersectsRect(bodyX, wallRect)) {
				collision.x = true
			}
			// Checks with a lookahead on y:
			if (circleIntersectsRect(bodyY, wallRect)) {
				collision.y = true
			}
		} else {
			// Checks with a lookahead on x:
			if (circleIntersectsEdge(bodyX)) {
				collision.x = true
			}
			// Checks with a lookahead on y:
			if (circleIntersectsEdge(bodyY)) {
				collision.y = true
			}
		}

		return collision
	}

	// Halts movement:
	handleBodyCollision(axes) {

		if (axes.x) {
			this.moveCoords.dX = 0
			this.moveCoords.dY /= config.tank.collisionMoveSlow
		}
		if (axes.y) {
			this.moveCoords.dY = 0
			this.moveCoords.dX /= config.tank.collisionMoveSlow
		}
	}

	// Checks both wall and edge collisions:
	checkCannonCollision(wall = null) {

		// To be returned:
		const collision = {
			x: false,
			y: false
		}

		//* Checking wall collisions:
		if (wall) {
			const wallRect = getWallRect(wall)

			for (let i = this.r; i <= config.tank.cannon.length; i++) {

				// Every point on the cannon...
				const point = getOffsetPoint(i, this.direction)
				// Relative to the tank's next pos:
				const nextPoint = {
					x: point.x + this.next.x,
					y: point.y + this.next.y
				}
				// Relative to the tank:
				point.x += this.x
				point.y += this.y

				if (pointInRect({ x: nextPoint.x, y: point.y }, wallRect)) {
					collision.x = true
				}
				if (pointInRect({ x: point.x, y: nextPoint.y }, wallRect)) {
					collision.y = true
				}
			}

			//* Checking edge collisions:
		} else {
			const nextCannonTip = {
				x: this.next.x + this.relCannon.x,
				y: this.next.y + this.relCannon.y
			}

			const out = outOfBounds(nextCannonTip.x, nextCannonTip.y)

			if (out.x) {
				collision.x = true
			}
			if (out.y) {
				collision.y = true
			}
		}

		return collision
	}

	handleCannonCollision(axes) {
		// Halts / slows movement:
		if (axes.x) {
			this.moveCoords.dX = 0
			this.moveCoords.dY /= config.tank.collisionMoveSlow
		}
		if (axes.y) {
			this.moveCoords.dX /= config.tank.collisionMoveSlow
			this.moveCoords.dY = 0
		}

		// Turns slowly, if driving forward:
		for (const axis in axes) {
			if (axes[axis] && this.driving === 'forward') {
				this.turn(getTurnDirection(axis, this.direction), true) // true lowers the turnspeed for collisions
			}
		}
	}

	checkTurnCollision(wall = null) {

		const nextDir = (this.direction % 360) + this.turnSpeed * this.turning

		//* Wall collisions:
		if (wall) {
			const wallRect = getWallRect(wall)

			// Starts from edge of tank, not cannon root:
			for (let i = this.r; i <= config.tank.cannon.length; i++) {

				// Every point on the cannon...
				const nextPoint = getOffsetPoint(i, nextDir)

				// Relative to the recalculated next location of the tank (since we don't want to turn and then move in the "old" direction)
				nextPoint.x += this.next.x
				nextPoint.y += this.next.y

				if (pointInRect({ x: nextPoint.x, y: nextPoint.y }, wallRect)) {
					return true
				}
			}

			//* Edge collisions:
		} else {
			const nextCannonTip = {
				x: this.next.x + this.relCannon.x,
				y: this.next.y + this.relCannon.y
			}
			const out = outOfBounds(nextCannonTip.x, nextCannonTip.y)

			if (out.x || out.y) {
				return true
			}
		}
	}

	handleTurnCollision() {
		this.turning = 0
	}

	// Takes -1 for left and 1 for right:
	turn(turnDirection, bodyCollision = false) {
		if (bodyCollision) {
			// % 360 makes it so we don't have to deal with angles over 360 deg:
			this.direction = (this.direction % 360) + this.turnSpeed / config.tank.collisionTurnSlow * turnDirection //TODO: Maybe use rotate() when we switch to sprites
		} else {
			this.direction = (this.direction % 360) + this.turnSpeed * turnDirection //TODO: Maybe use rotate() when we switch to sprites
		}
	}

	move() {
		// Takes collisions into consideration, since moveCoords will be updated accordingly
		if (this.driving) {
			this.x += this.moveCoords.dX
			this.y += this.moveCoords.dY
		}

		// Updates cannon coords:
		const tip = getOffsetPoint(config.tank.cannon.length, this.direction) // Same function as with moving - gets coords based on distance from center and a direction
		this.relCannon.x = tip.x
		this.relCannon.y = tip.y
	}

	fire() {
		if (this.equipment) {

			this.equipment.use() || console.log("You cannot use this item at the moment.")

		} else if (this.ammo > 0) {
			this.ammo--
			state.projectiles.bullets.push(new Bullet(this))

			shake() // Global effect
		}
	}

	// Adds a trail point if tank is not standing still:
	addTrailPoint() {
		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
		}
	}

	show() {
		push()

		stroke(51)
		fill(this.color)

		// Renders body:
		push()

		strokeWeight(1)
		circle(this.x, this.y, this.d)

		pop()

		// Renders cannon:
		push()

		strokeWeight(config.tank.cannon.width)
		translate(this.x, this.y)
		rotate(this.direction)
		line(this.d / config.tank.cannon.midOffsetFraction, 0, config.tank.cannon.length, 0) // Straight line the length of the cannon

		pop()

		pop()
	}

	// Uses index number to remove tank from the game:
	destroy(i) {
		state.tanks.splice(i, 1)

		Game.tankDestroyed()
		//TODO: Msg on death or counter etc + effect
	}

	// Called every frame:
	onFrame() {
		this.move()
		this.addTrailPoint()
		this.turn(this.turning) // Importantly done after .move() because of collision checking being done in the same order
		this.show()
	}

	//* STATIC METHODS

	//? FLYT UD?
	static checkHit(bullet, tank) {
		// Distance between center of tank and bullet:
		const distance = dist(bullet.x, bullet.y, tank.x, tank.y)

		// Checks if distance is smaller, when width of tank and bullet have been factored in:
		if (distance < config.bullet.diameter / 2 + tank.d / 2) { // Does not use bullet.d, since the muzzle effect changes that size
			return true
		}
	}
}