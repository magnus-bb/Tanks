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
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }] //? For death recap - maybe
		this.controls = controls
		this.moveCoords = {
			dX: 0,
			dY: 0
		}

		/* Used to check if the tank is turning in a frame, to be able to "bounce" back, if there is a turn collision.
		It is not possible to just annull the turning, since the new coords have to be present when checking for tank collisions: */
		this.turning = 0

		const relCannonRoot = getOffsetPoint(this.d / config.tank.cannon.midOffsetFraction, this.direction)
		const relCannonTip = getOffsetPoint(config.tank.cannon.length, this.direction)
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
			this.turn(-1)
			this.turning = -1
		}
		if (keyIsDown(this.controls.right)) {
			this.turn(1)
			this.turning = 1
		}

		// Angle and amount (if any) to move:
		const move = getOffsetPoint(this.moveSpeed, this.direction, this.driving)
		this.moveCoords.dX = move.x
		this.moveCoords.dY = move.y
	}

	// Takes -1 for left and 1 for right:
	turn(direction, bodyCollision = false) {
		if (bodyCollision) {
			// % 360 makes it so we don't have to deal with angles over 360 deg:
			this.direction = (this.direction % 360) + this.turnSpeed / config.tank.collisionTurnSlow * direction //TODO: Maybe use rotate() when we switch to sprites
		} else {
			this.direction = (this.direction % 360) + this.turnSpeed * direction //TODO: Maybe use rotate() when we switch to sprites
		}
	}

	// Checks both wall and edge collisions:
	checkBodyCollision(wall = null) { // Defaults to check edge-collisions
		const collision = {
			x: false,
			y: false
		}

		// // const body = {
		// // 	x: this.next.x,
		// // 	y: this.next.y,
		// // 	r: this.r
		// // }

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
			if (bodyIntersectsWall(bodyX, wallRect)) {
				collision.x = true
			}
			// Checks with a lookahead on y:
			if (bodyIntersectsWall(bodyY, wallRect)) {
				collision.y = true
			}
		} else {
			// Checks with a lookahead on x:
			if (bodyIntersectsEdge(bodyX)) {
				collision.x = true
			}
			// Checks with a lookahead on y:
			if (bodyIntersectsEdge(bodyY)) {
				collision.y = true
			}
		}

		return collision
	}

	// Halts movement:
	handleBodyCollision(axes, /*wallObj = null*/) {
		// During wall checks, also has to check if any point on cannon intersects with wall, cannon will not get stuck while sliding:
		// if (wallObj) {
		// 	if (this.checkTurnCollision(wallObj)) {
		// 		this.moveCoords.dX = 0
		// 		this.moveCoords.dY = 0
		// 		return
		// 	}
		// }

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

		const nextCannonTip = {
			x: this.next.x + this.relCannon.tip.x,
			y: this.next.y + this.relCannon.tip.y
		}

		// To be returned:
		const collision = {
			x: false,
			y: false
		}

		//* Checking wall collisions:
		if (wall) {
			const wallRect = getWallRect(wall)

			//! TEST FROM
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
				//! TEST TO

				if (pointInRect({ x: /*nextCannonTip*/nextPoint.x, y: /*this.cannon.tip*/point.y }, wallRect)) {
					collision.x = true
				}
				if (pointInRect({ x: /*this.cannon.tip*/point.x, y: /*nextCannonTip*/nextPoint.y }, wallRect)) {
					collision.y = true
				}
			} //! ALSO TEST BRACKET

			//* Checking edge collisions:
		} else {
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
				// console.log(axis, axes[axis])
				this.turn(getTurnDirection(axis, this.direction), true) // true lowers the turnspeed for collisions
			}
		}
	}

	checkTurnCollision(wall = null) {
		if (wall) {
			var wallRect = getWallRect(wall)
		}

		// Starts from edge of tank, not cannon root:
		for (let i = this.r; i <= config.tank.cannon.length; i++) {

			// Every point on the cannon...
			const point = getOffsetPoint(i, this.direction)
			// Relative to the tank:
			point.x += this.x
			point.y += this.y

			//* Wall collisions:
			if (wall) {
				if (pointInRect({ x: point.x, y: point.y }, wallRect)) {
					return true
				}

				//* Edge collisions:
			} else {
				const out = outOfBounds(point.x, point.y)

				if (out.x || out.y) {
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
		if (this.driving) {
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
		const root = getOffsetPoint(this.d / config.tank.cannon.midOffsetFraction, this.direction) // Same function as with moving - gets coords based on distance from center and a direction
		const tip = getOffsetPoint(config.tank.cannon.length, this.direction) // Same function as with moving - gets coords based on distance from center and a direction
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

		// Checks if game should end:
		if (state.tanks.length <= 1) {
			Game.end()
		}
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

	static randomSpawnCoords() {
		// Random cell:
		const col = floor(random(0, config.env.cellAmtX))
		const row = floor(random(0, config.env.cellAmtY))
		const cell = getCell(col, row)

		// Midpoint of cell:
		const x = cell.x + cell.w / 2
		const y = cell.y + cell.w / 2

		return { x: x, y: y }
	}
}