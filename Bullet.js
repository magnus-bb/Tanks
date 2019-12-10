export default class Bullet { //TODO: Should be extension of a Projectile class, so other weapons can extend as well
	constructor(owner) {
		this.d = config.bullet.diameter * config.effects.muzzleSize // Initial size is bigger for a muzzle flash effect
		this.direction = owner.direction
		this.speed = config.bullet.speed

		this.owner = owner

		// Starts offset from tank center:
		this.x = (owner.d / 2 + this.d / 2 + 1) * cos(radians(this.direction)) + owner.x //TODO: ONLY NEEDS POINT AT THE TIP OF THE CANNON
		this.y = (owner.d / 2 + this.d / 2 + 1) * sin(radians(this.direction)) + owner.y //TODO: ONLY NEEDS POINT AT THE TIP OF THE CANNON

		this.duration = config.bullet.duration
		this.color = color(red(this.owner.color), green(this.owner.color), blue(this.owner.color))

		const move = getMoveCoords(this.speed, this.direction, 'forward')
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}

		this.trail = [] 
	}

	//! WHEN FIRING INSIDE WALL, BULLET GETS STUCK
	checkCollision(wall, side) {
		const numSteps = config.env.collisionLookaheadSteps // How many positions to check between bullet location and next frames' location
		const wallWidth = config.env.wallWidth / 2 // +/- from center of wall

		const longAxis = side === 'right' ? 'y' : 'x' // Hack to help add wallWidth when needed and vice versa
		const shortAxis = side === 'bottom' ? 'y' : 'x'

		const shortAxisPointOne = wall[shortAxis + '1'] - wallWidth
		const shortAxisPointTwo = wall[shortAxis + '1'] + wallWidth

		// Looks at "all" positions between location and next location
		for (let step = 1; step <= numSteps; step++) {
			const lookAhead = {
				x: this.x + this.moveCoords.dX / numSteps * step,
				y: this.y + this.moveCoords.dY / numSteps * step
			}

			// Interaction with walls:
			const bounce = { x: false, y: false }
			if (between(lookAhead[longAxis], wall[longAxis + '1'], wall[longAxis + '2']) && between(this[shortAxis], shortAxisPointOne, shortAxisPointTwo)) {
				bounce[longAxis] = true
			}
			if (between(this[longAxis], wall[longAxis + '1'], wall[longAxis + '2']) && between(lookAhead[shortAxis], shortAxisPointOne, shortAxisPointTwo)) {
				bounce[shortAxis] = true
			}

			// Interaction with edges of convas:
			if (lookAhead.x <= 0 + wallWidth || lookAhead.x >= width - wallWidth) {
				bounce.x = true
			}
			if (lookAhead.y <= 0 + wallWidth || lookAhead.y >= height - wallWidth) {
				bounce.y = true
			}

			// A collision calls the bounce and stops further lookAheads
			if (bounce.x || bounce.y) {
				this.bounce(bounce)
				break
			}
		}
	}

	bounce(axis) {
		// Reverses move direction of the axis
		if (axis.x) {
			this.moveCoords.dX *= -1
		}
		if (axis.y) {
			this.moveCoords.dY *= -1
		}

		// Updates direction to match the new moveCoords
		this.direction = getDirection(this.moveCoords.dX, this.moveCoords.dY)
	}

	move() {
		// Sets the points for the trail
		this.makeTrail()

		// Moves bullet
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	// Makes a trail point for each frame
	makeTrail() {
		this.trail.push({ x: this.x, y: this.y })
		if (this.trail.length > config.effects.bulletTrailLength) {
			this.trail.shift()
		}
	}

	show(index) {
		// Removes projectile after duration has passed
		if (this.duration <= 0) {
			this.destroy(index)
		} else {

			// Main bullet
			this.color.setAlpha(255) // Resets from the low opacity on trail
			noStroke()
			fill(this.color)
			circle(this.x, this.y, this.d)

			// Renders trail
			this.showTrail()

			// Resizes bullet for muzzle flash effect
			if (this.d > config.bullet.diameter) {
				this.d -= config.effects.muzzleSpeed
			} else {
				this.d = config.bullet.diameter
			}

			this.duration--
		}
	}

	showTrail() {
		this.color.setAlpha(config.effects.bulletTrailAlpha) // Lower opacity than normal
		fill(this.color)
		for (let i = 0; i < this.trail.length; i++) {

			// Returns a diameter between 3 px and bullet diameter according to how close to the bullet the point is
			let d = lerp(3, this.d, i / (this.trail.length - 1))
			circle(this.trail[i].x, this.trail[i].y, d)
		}
	}

	// Uses index number to remove projectile from the game:
	destroy(index) {
		state.projectiles.splice(index, 1)

		this.owner.ammo++
	}
}