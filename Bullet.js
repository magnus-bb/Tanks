class Bullet { //TODO: Should be extension of a Projectile class, so other weapons can extend as well
	constructor(owner) {
		this.d = config.bullet.diameter * config.effects.muzzleSize // Initial size is bigger for a muzzle flash effect
		this.direction = owner.direction
		this.speed = config.bullet.speed
		this.owner = owner
		// Starts offset from tank center:
		this.x = this.owner.cannon.tip.x
		this.y = this.owner.cannon.tip.y

		this.duration = config.bullet.duration
		this.color = color(this.owner.color) // Must convert to P5-color object to be able to set alpha
		const move = getOffsetPoint(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}
		// For knowing when to stop rendering trail:
		this.dead = false
	}

	//* INSTANCE METHODS

	// Both wall and edge collisions:
	checkCollision(wall = null) {
		const numSteps = config.env.collisionLookaheadSteps // How many positions to check between bullet location and next frames' location

		// Wall collisions only:
		if (wall) { // Check is done before loop as to not reassign every iteration
			var wallRect = getWallRect(wall)
		}

		// Looks at "all" positions between location and (fraction of) 'next' location:
		for (let step = 1; step <= numSteps; step++) {
			const next = {
				x: this.x + this.moveCoords.dX / numSteps * step,
				y: this.y + this.moveCoords.dY / numSteps * step
			}

			const bounce = {
				x: false,
				y: false
			}

			//* Wall collisions:
			if (wall) {
				if (pointInRect({ x: next.x, y: this.y }, wallRect)) {
					bounce.x = true
				}
				if (pointInRect({ x: this.x, y: next.y }, wallRect)) {
					bounce.y = true
				}

				//* Edge collisions:
			} else {
				const out = outOfBounds(next.x, next.y)

				if (out.x) {
					bounce.x = true
				}
				if (out.y) {
					bounce.y = true
				}
			}

			// A collision calls the bounce and stops further lookaheads:
			if (bounce.x || bounce.y) {
				return bounce

				// Last lookAhead step also returns empty bounce:
			} else if (step === numSteps) { 
				return bounce
			}
		}
	}

	bounce(axis) {
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
		const trails = state.projectiles.trails // Trails are made in state to allow for continuous rendering when bullet is destroyed

		// When first point is made, the bullet's trail has to be initiated:
		if (!trails.has(bullet)) {
			trails.set(bullet, [])
		}

		const trail = state.projectiles.trails.get(bullet)

		trail.push({ x: this.x, y: this.y })
	}

	show(index) {
		// Removes projectile after duration has passed:
		if (this.duration <= 0) {
			this.destroy(index)
		} else {

			// Main bullet
			this.color.setAlpha(255) // Resets from the low opacity on trail
			noStroke()
			fill(this.color)
			circle(this.x, this.y, this.d)

			// Resizes bullet for muzzle flash effect:
			if (this.d > config.bullet.diameter) {
				this.d -= config.effects.muzzleSpeed
			} else {
				this.d = config.bullet.diameter
			}

			this.duration--
		}
	}

	// Uses index number to remove projectile from the game:
	destroy(index) {
		this.dead = true
		state.projectiles.bullets.splice(index, 1)

		this.owner.ammo++
	}

	//* STATIC METHODS

	static showTrail(trailPair) { // Trailpair couples bullet to trail, since bullet cannot house trail itself
		const bullet = trailPair[0]
		const trail = trailPair[1]
		const color = bullet.color

		if (trail.length <= 0 && bullet.dead) {
			// Removes trail, when all points have run out:
			state.projectiles.trails.delete(bullet)
		} else {
			// Keeps the trail from growing forever:
			if (trail.length > config.effects.bulletTrailLength) {
				trail.shift()
			}

			// Important to control every draw phase, as to not just inherit any properties of another drawing:
			color.setAlpha(config.effects.bulletTrailAlpha) // Lower opacity than bullet)
			noStroke()
			fill(color)

			for (let i = 0; i < trail.length; i++) {
				// Lerp returns a diameter between 3 px and bullet diameter according to how close to the bullet the point is
				const d = lerp(3, bullet.d, i / (trail.length - 1))

				circle(trail[i].x, trail[i].y, d)
			}

			if (bullet.dead === true) {
				trail.shift()
			}
		}
	}
}