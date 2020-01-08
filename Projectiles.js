// // class Projectile { //TODO: LAV EN SAMLING AF GÆNGSE METODER OSV OG BRUG COMPOSITION
// // 	constructor(owner) {
// // 		this.owner = owner
// // 	}

// // 	destroy(i) {

// // 	}
// // }

class Bullet { //TODO: Should be extension of a Projectile class, so other weapons can extend as well (or use composition)
	constructor(owner) {
		this.owner = owner
		this.type = 'bullet'
		this.d = config.bullet.diameter // Initial size is bigger for a muzzle flash effect
		this.direction = owner.direction
		this.speed = config.bullet.speed
		this.x = this.owner.cannon.x
		this.y = this.owner.cannon.y
		this.duration = config.bullet.duration
		this.color = color(this.owner.color) // Must convert to P5-color object to be able to set alpha
		const move = getOffsetPoint(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}
		this.next = { // Updated every frame instead of getter (that runs in too many loops)
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		// For knowing when to stop rendering trail:
		this.dead = false
	}

	//* INSTANCE METHODS

	collision(i, wall = null) { // Index is passed with all projectiles, since some need it to remove() (but not this one)
		const bounceAxis = this._checkCollision(wall) // Automatically checks wall collisions when args are given

		if (bounceAxis.x || bounceAxis.y) {
			this._bounce(bounceAxis)
		}
	}

	// Both wall and edge collisions:
	_checkCollision(wall) { // 'wall' can be passed as null, if we are checking edges
		const numSteps = this.speed // check for every frame of movement

		// Wall collisions only:
		if (wall) { // Check is done before loop as to not reassign every iteration
			var wallRect = getWallRect(wall)
		}

		const bounce = {
			x: false,
			y: false
		}

		//* Wall collisions:
		if (wall) {
			if (pointInRect({ x: this.next.x, y: this.y }, wallRect)) {
				bounce.x = true
			}
			if (pointInRect({ x: this.x, y: this.next.y }, wallRect)) {
				bounce.y = true
			}

			//* Edge collisions:
		} else {
			const out = outOfBounds(this.next.x, this.next.y)

			if (out.x) {
				bounce.x = true
			}
			if (out.y) {
				bounce.y = true
			}
		}

		// If values are truthy will be checked in collision()
		return bounce
	}

	_bounce(axis) {
		// Reverses move direction of the axis:
		if (axis.x) {
			this.moveCoords.dX *= -1
		}
		if (axis.y) {
			this.moveCoords.dY *= -1
		}

		// Updates direction to match the new moveCoords:
		this.direction = getDirection(this.moveCoords.dX, this.moveCoords.dY)
	}

	move() {
		// Sets the points for the trail:
		this.makeTrail(this)

		// Moves bullet:
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	// Makes a trail point for each frame:
	makeTrail(bullet) {
		const trails = state.bulletTrails // Trails are made in state to allow for continuous rendering when bullet is destroyed

		// When first point is made, the bullet's trail has to be initiated:
		if (!trails.has(bullet)) {
			trails.set(bullet, [])
		}

		const trail = state.bulletTrails.get(bullet)

		trail.push({ x: this.x, y: this.y })
	}

	show() {

		// Drawn diameter is increased in first few frames for a muzzle effect:
		let drawDiameter = this.d * config.effects.muzzleSize - (config.bullet.duration - this.duration) * config.effects.muzzleSpeed
		drawDiameter = drawDiameter > this.d ? drawDiameter : this.d

		push()

		noStroke()
		fill(this.color)
		circle(this.x, this.y, drawDiameter)

		pop()
	}

	updateNext() {
		this.next = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	destroy(i) {
		this.dead = true

		state.projectiles.splice(i, 1)

		this.owner.ammo++
	}

	// Called once every frame:
	onFrame(i) {
		this.move()
		this.show()
		this.updateNext()

		this.duration--

		if (this.duration <= 0) {
			this.destroy(i)
		}
	}

	//* STATIC METHODS

	static showTrail(trailPair) { // Trailpair couples bullet to trail, since bullet cannot house trail itself
		const bullet = trailPair[0]
		const trail = trailPair[1]

		if (trail.length <= 0 && bullet.dead) {
			// Removes trail, when all points have run out:
			state.bulletTrails.delete(bullet)
		} else {
			// Keeps the trail from growing forever:
			if (trail.length > config.effects.bulletTrailLength) {
				trail.shift()
			}

			push()

			bullet.color.setAlpha(config.effects.bulletTrailAlpha) // Lower opacity than bullet)
			fill(bullet.color)
			noStroke()

			for (let i = 0; i < trail.length; i++) {
				// Lerp returns a diameter between 3 px and bullet diameter according to how close to the bullet the point is
				const d = lerp(3, bullet.d, i / (trail.length - 1))

				circle(trail[i].x, trail[i].y, d)
			}

			// Resets alpha, since it carries over:
			bullet.color.setAlpha(255)

			pop()

			if (bullet.dead === true) {
				trail.shift()
			}
		}
	}
}

class M82Bullet {
	constructor(owner) {
		this.owner = owner
		this.type = 'm82'
		this.d = config.equipment.m82Diameter
		this.direction = owner.direction
		this.speed = config.equipment.m82Speed
		this.x = this.owner.cannon.x
		this.y = this.owner.cannon.y
		this.color = this.owner.color // Convert to p5-color (like Bullet) if alpha is needed
		const move = getOffsetPoint(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}
		this.next = { // Is updated every frame (since a getter would recalc every wall * frame etc)
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	collision(i, wall = null) {
		if (this._checkCollision(wall)) {
			this.destroy(i)
		}
	}

	//! PASSES THROUGH WALLS
	_checkCollision(wall) { // 'wall' can be passed as null, if we are checking edges

		// Does not need to be as complex when it doesn't bounce (doesn't need to calculate the axis of impact):
		//* Edge collisions:
		if (!wall) {
			// outOfBounds() always returns object (truthy) to also get an axis, even though just true/false is used here:
			const { x, y } = outOfBounds(this.next.x, this.next.y)

			if (x || y) {
				return true // NOTHING (not even false) may be returned if !x || !y, since this stops looping
			}

		} else { //* Wall collisions:

			const wallRect = getWallRect(wall)

			// Looks at "all" positions between location and (fraction of) 'next' location:
			for (let step = 0; step <= this.speed; step += config.env.collisionStepSize) {

				// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
				const next = {
					x: this.x + this.moveCoords.dX * (step / this.speed),
					y: this.y + this.moveCoords.dY * (step / this.speed)
				}

				if (pointInRect({ x: next.x, y: next.y }, wallRect)) {
					return true // NOTHING (not even false) may be returned if !pointInRect, since this stops looping
				}
			}
		}
	}

	move() {
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	show() {
		push()

		noStroke()
		fill(this.color)
		circle(this.x, this.y, this.d)

		pop()
	}

	updateNext() {
		this.next = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	destroy(i) {
		state.projectiles.splice(i, 1)
	}

	onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
		this.move()
		this.show()
		this.updateNext()
	}
}