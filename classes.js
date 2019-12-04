//* Player
class Tank {
	constructor(name, x, y, forward = UP_ARROW, right = RIGHT_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, fire = 32) {
		this.name = name
		this.x = x //TODO: Spawn in middle of cell
		this.y = y
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
	}

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
			// % 360 makes it so we don't have to deal with angles over 360 deg
			this.turn(-1)
		}

		if (keyIsDown(this.keybindings.right)) {
			this.turn(1)
		}

		// Angle and amount (if any) to move
		const move = getMoveCoords(this.moveSpeed, this.direction, this.drive)
		this.moveCoords.dX = move.x
		this.moveCoords.dY = move.y
	}

	// Takes -1 for left and 1 for right
	turn(direction, collision = false) {
		if (collision) {
			this.direction = (this.direction % 360) + this.turnSpeed / config.player.collisionTurnFactor * direction //TODO: Maybe use rotate() when we switch to sprites
		} else {
			this.direction = (this.direction % 360) + this.turnSpeed * direction //TODO: Maybe use rotate() when we switch to sprites
		}
	}

	outOfBounds() {
		const wallWidth = config.environment.wallWidth / 2 // +/- from center of wall

		// Next tank position (if no collision is observed)
		const lookAhead = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		// Interaction with edges of convas:
		if (lookAhead.x <= 0 + wallWidth || lookAhead.x >= width - wallWidth) {
			this.handleCollision('x')
		}
		if (lookAhead.y <= 0 + wallWidth || lookAhead.y >= height - wallWidth) {
			this.handleCollision('y')
		}
	}

	checkCollision(wall, side) {
		const wallWidth = config.environment.wallWidth / 2 // +/- from center of wall

		const longAxis = side === 'right' ? 'y' : 'x' // Hack to help add wallWidth when needed and vice versa
		const shortAxis = side === 'bottom' ? 'y' : 'x'

		const shortAxisPointOne = wall[shortAxis + '1'] - wallWidth
		const shortAxisPointTwo = wall[shortAxis + '1'] + wallWidth

		// Next tank position (if no collision is observed):
		const lookAhead = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		//TODO: Include whole body of tank + cannon

		// Interaction with walls:
		if (between(lookAhead[longAxis], wall[longAxis + '1'], wall[longAxis + '2']) && between(this[shortAxis], shortAxisPointOne, shortAxisPointTwo)) {
			this.handleCollision(longAxis)
		}
		if (between(this[longAxis], wall[longAxis + '1'], wall[longAxis + '2']) && between(lookAhead[shortAxis], shortAxisPointOne, shortAxisPointTwo)) {
			this.handleCollision(shortAxis)
		}
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

		// // //TODO: Add jitter effect
		// // const axisDir = this.moveCoords[deltaAxis] > 0 ? 1 : -1
		// // this[axis] -= axisDir * config.player.jitterFactor

		// Turning
		this.turn(getTurnDirection(axis, this.direction), true) // true lowers the turnspeed for collisions
	}

	move() {
		// Takes collisions into consideration, since moveCoords will be updated accordingly
		if (this.drive) {
			this.x += this.moveCoords.dX
			this.y += this.moveCoords.dY
		}

		// Trail only updates if tank is not standing still
		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
		}
	}

	fire() {
		if (this.weapon) {
			//TODO: Use weapon
		} else if (this.ammo > 0) {
			this.ammo--
			state.projectiles.push(new Bullet(this))

			shake() // Global effect
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
		const cannonXStart = (this.d / 5) * cos(radians(this.direction)) + this.x
		const cannonYStart = (this.d / 5) * sin(radians(this.direction)) + this.y
		const cannonXEnd = config.player.cannonLength * cos(radians(this.direction)) + this.x
		const cannonYEnd = config.player.cannonLength * sin(radians(this.direction)) + this.y
		// Cannon
		strokeWeight(3)
		line(cannonXStart, cannonYStart, cannonXEnd, cannonYEnd)
	}
}

//TODO: Should be extension of a Projectile class, so other weapons can extend as well
class Bullet {
	constructor(owner) {
		// Initial size is bigger for a muzzle flash effect
		this.d = config.bullet.diameter * config.effects.muzzleSize
		// Moves in direction that owner was pointing:
		this.direction = owner.direction
		this.speed = config.bullet.speed
		this.owner = owner
		// Starts offset from tank center:
		this.x = (owner.d / 2 + this.d / 2 + 1) * cos(radians(this.direction)) + owner.x //TODO: ONLY NEEDS POINT AT THE TIP OF THE CANNON
		this.y = (owner.d / 2 + this.d / 2 + 1) * sin(radians(this.direction)) + owner.y //TODO: ONLY NEEDS POINT AT THE TIP OF THE CANNON
		// First frame alive is used to fade projectile
		this.startFrame = frameCount

		// Direction only needs to be recalculated every bounce on projectiles and on spawn:
		const move = getMoveCoords(this.speed, this.direction, 'forward')
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}

		// For effects:
		this.tail = []
	}

	//! WHEN FIRING INSIDE WALL, BULLET GETS STUCK
	checkCollision(wall, side) {
		const numSteps = config.environment.collisionLookaheadSteps // How many positions to check between bullet location and next frames' location
		const wallWidth = config.environment.wallWidth / 2 // +/- from center of wall

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
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
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
		// TODO: Add fade / effect
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
		// Makes a wall at chance, if wall is not on canvas edge
		this.walls = {
			right: this.x !== width - config.environment.cellWidth ? this.randomWall('right') : null,
			bottom: this.y !== height - config.environment.cellWidth ? this.randomWall('bottom') : null
		}
		// For creating the maze:
		this.visited = false
	}

	randomWall(side) {
		return random() < config.environment.wallOccurrence ? new Wall(this, side) : null
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
		strokeCap(ROUND) //? PROJECT?
		stroke(41)
		line(this.x1, this.y1, this.x2, this.y2)
	}
}