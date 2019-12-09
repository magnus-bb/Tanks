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
		const wallWidth = config.env.wallWidth / 2 // +/- from center of wall

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
		const wallWidth = config.env.wallWidth / 2 // +/- from center of wall
		const rad = this.d / 2 //! Testing

		// Which side of the wall is the long side and which is the end:
		const longAxis = side === 'right' ? 'y' : 'x' // Hack to help add wallWidth when needed and vice versa
		const shortAxis = side === 'bottom' ? 'y' : 'x'

		// Gets the pseudo width of the line, to be able to check if a point is inside the "rectangle":
		const shortAxisPointOne = wall[shortAxis + '1'] - wallWidth
		const shortAxisPointTwo = wall[shortAxis + '1'] + wallWidth

		// Next tank position (if no collision is observed):
		const lookAhead = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		//TODO: Include cannon
		//TODO: Abstract this into helpers
		//TODO: Make it like a circle, not a square

		//* Best
		if ((between(lookAhead[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(lookAhead[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(shortAxisPointOne, this[shortAxis] - rad, this[shortAxis] + rad) || between(shortAxisPointTwo, this[shortAxis] - rad, this[shortAxis] + rad))) {
			this.handleCollision(longAxis)
		}
		if ((between(this[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(this[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(shortAxisPointOne, lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad) || between(shortAxisPointTwo, lookAhead[shortAxis] - rad, lookAhead[shortAxis] + rad))) {
			this.handleCollision(shortAxis)
		}

		// //! Better:
		// // Interaction with walls:
		// if ((between(lookAhead[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(lookAhead[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(this[shortAxis] + rad, shortAxisPointOne, shortAxisPointTwo) || between(this[shortAxis] - rad, shortAxisPointOne, shortAxisPointTwo))) {
		// 	this.handleCollision(longAxis)
		// }
		// if ((between(this[longAxis] - rad, wall[longAxis + '1'], wall[longAxis + '2']) || between(this[longAxis] + rad, wall[longAxis + '1'], wall[longAxis + '2'])) && (between(lookAhead[shortAxis] + rad, shortAxisPointOne, shortAxisPointTwo) || between(lookAhead[shortAxis] - rad, shortAxisPointOne, shortAxisPointTwo))) {
		// 	this.handleCollision(shortAxis)
		// }

		//! Original: 
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
		fill(this.color)
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
		this.duration = config.bullet.duration
		this.color = color(red(this.owner.color), green(this.owner.color), blue(this.owner.color))

		// Direction only needs to be recalculated every bounce on projectiles and on spawn:
		const move = getMoveCoords(this.speed, this.direction, 'forward')
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}

		// For effects:
		this.trail = [] // Not called trail, so it won't overlap with the method
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
		// // Adds lingering 'Poof!' text in place:
		// state.effects.poofs.push(new Poof(this.x, this.y))

		// Removes projectile:
		state.projectiles.splice(index, 1)

		this.owner.ammo++
	}
}








//* Environment
class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.env.cellWidth
		// Makes a wall at chance, if wall is not on canvas edge
		this.walls = {
			right: this.x !== width - config.env.cellWidth ? this.randomWall('right') : null,
			bottom: this.y !== height - config.env.cellWidth ? this.randomWall('bottom') : null
		}
		// For creating the maze:
		this.visited = false
	}

	randomWall(side) {
		return random() < config.env.wallOccurrence ? new Wall(this, side) : null
	}

}

class Wall {
	constructor(owner, side) {
		this.x1 = owner.x
		this.y1 = owner.y
		this.x2 = owner.x
		this.y2 = owner.y
		this.w = config.env.wallWidth

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

// //* Effects:
// class Poof {
// 	constructor(x, y) {
// 		this.text = config.bullet.destructionText
// 		this.x = x
// 		this.y = y
// 		this.duration = config.bullet.destructionEffectDuration
// 	}

// 	show(index) {
// 		if (this.duration <= 0) {
// 			// Removes effect:
// 			state.effects.poofs.splice(index, 1)
// 		} else {
// 			// Displays effect:
// 			textAlign(CENTER, CENTER)
// 			textSize(14)
// 			textStyle(BOLD)
// 			stroke(0)
// 			strokeWeight(3)
// 			textFont('Comic Sans MS')
// 			text(this.text, this.x, this.y)

// 			this.duration--
// 		}
// 	}
// }