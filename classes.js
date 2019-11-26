//! Player
class Tank {
	constructor(name, x, y, forward = UP_ARROW, right = RIGHT_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, fire = 32) {
		this.name = name
		this.x = x
		this.y = y
		this.d = config.player.diameter
		this.moveSpeed = config.player.moveSpeed
		this.turnSpeed = config.player.turnSpeed
		this.color = randomColor()
		this.direction = 0 //! in degrees - converted to radians for moving
		this.ammo = config.player.ammo
		this.weapon = null
		this.trail = [{ x: this.x, y: this.y }] // For death recap - maybe
		this.keybindings = {
			forward: forward,
			backward: backward,
			left: left,
			right: right,
			fire: fire
		}
	}

	move() {
		// Angle and amount to move
		const move = getMoveCoords(this.moveSpeed, this.direction)

		// Controls-handling
		if (keyIsDown(this.keybindings.forward)) {
			this.x += move.x
			this.y += move.y
		}
		if (keyIsDown(this.keybindings.backward)) {
			this.x -= move.x
			this.y -= move.y
		}
		if (keyIsDown(this.keybindings.left)) {
			// % 360 makes it so we don't have to deal with angles over 360 deg
			this.direction = (this.direction % 360) - this.turnSpeed
			//console.log(this.direction) //! DELETE
		}
		if (keyIsDown(this.keybindings.right)) {
			this.direction = (this.direction % 360) + this.turnSpeed
			//console.log(this.direction) //! DELETE
		}

		// Trail only updates if tank is not standing still
		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
		}
	}

	fire() {
		if (this.weapon) {
			// Make class for each weapon?
			// Use weapon
		} else if (this.ammo > 0) {
			this.ammo--
			// Keeps track of all bullets
			state.projectiles.push(new Bullet(this))
			shake(canvas)
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
		const cannonXStart = (this.d / 5) * cos(degsToRads(this.direction)) + this.x //! P5 ANGLE MODE?
		const cannonYStart = (this.d / 5) * sin(degsToRads(this.direction)) + this.y
		const cannonXEnd = config.player.cannonLength * cos(degsToRads(this.direction)) + this.x
		const cannonYEnd = config.player.cannonLength * sin(degsToRads(this.direction)) + this.y
		// Cannon
		strokeWeight(3)
		line(cannonXStart, cannonYStart, cannonXEnd, cannonYEnd)
	}
}

//! Should be extension of a Projectile class, so other weapons can extend as well
class Bullet {
	constructor(owner) {
		this.d = config.bullet.diameter * 3;
		// Moves in direction that owner was pointing:
		this.direction = owner.direction //! RECALCULATE DIRECTION AFTER EACH BOUNCE, SINCE BOUNCE JUST INVERTS COORDS
		this.speed = config.bullet.speed
		this.owner = owner // Who to give points to when colliding with tanks etc.
		// Starts offset from tank center:
		this.x = (owner.d / 2 + this.d / 2 + 1) * cos(degsToRads(this.direction)) + owner.x //! ONLY NEEDS POINT AT THE TIP OF THE CANNON
		this.y = (owner.d / 2 + this.d / 2 + 1) * sin(degsToRads(this.direction)) + owner.y //! ONLY NEEDS POINT AT THE TIP OF THE CANNON
		// First frame alive is used to fade projectile
		this.startFrame = frameCount

		this.tail = [];
	}


	move() {
		const move = getMoveCoords(this.speed, this.direction)

		this.x += move.x
		this.y += move.y

	}

	bounce() {
		for (const cell of state.cells) {
			for (const wall in cell.walls) { // All walls in all cells
				// If the wall exists, check for a collision (with the placement of the wall):
				if (cell.walls[wall]) {
					const collision = this.checkCollision(cell.walls[wall]) // Returns axis of wall and direction of bullet
					if (collision) {
						if (this.direction < 0) this.direction += 360 // Normalizes angle to positive equivalent - 90deg === -270deg etc.
						const axis = collision[0]
						const direction = collision[1]

						// The directions need to be positive for these hacks to work:
						//! ONLY NEEDS TO CHECK IF DIRECTION X/Y ARE POSITIVE OR NEGATIVE
						if (axis === 'vertical') {
							if (direction === 'upwards') {
								this.direction += (270 - this.direction) * 2
							} else /*downwards*/ {
								this.direction += (90 - this.direction) * 2
							}
						} else /*horizontal*/ {
							if (direction === 'right') {
								this.direction = (this.direction - 360) * -1
							} else /*left*/ {
								this.direction += (180 - this.direction) * 2
							}
						}
					}
				}
			}
		}
	}

	//! Does not check if ends of walls are hit
	//! https://happycoding.io/tutorials/processing/collision-detection - SEE RECT + RECT BUT WITH "RAYTRACING" per pixel of bullet movespeed between current pos and next pos
	checkCollision(wall) {
		const wallWidth = wall.w / 2 // Line thickness makes the walls a pseudo-rectangle that I can check for coordinates 'inside'

		// If projectile is directly next to a wall and inside its 'pseudo'-rectangle:
		if (between(this.y, wall.y1, wall.y2) && between(this.x, wall.x1 - wallWidth, wall.x1 + wallWidth)) {
			// Checks for the relevant moving direction of projectile:
			if (between(this.direction, -180, 0) || this.direction > 180) return ['vertical', 'upwards']
			if (between(this.direction, 0, 180) || this.direction < -180) return ['vertical', 'downwards']
		}
		// If projectile is directly above/below to a wall and inside its 'pseudo'-rectangle:
		if (between(this.x, wall.x1, wall.x2) && between(this.y, wall.y1 - wallWidth, wall.y1 + wallWidth)) {
			// Checks for the relevant moving direction of projectile:
			if (between(this.direction, -90, 90) || this.direction > 270 || this.direction < -270) return ['horizontal', 'right']
			if (between(this.direction, -270, -90) || between(this.direction, 90, 270)) return ['horizontal', 'left']
		}

		// If no collissions
		return null
	}

	show() {
		let ownerColor = color(this.owner.color);

		this.tail.push({x: this.x, y: this.y});
		if(this.tail.length > 40){
			this.tail.shift();
		}

		// Just a black circle
		noStroke()
		fill(ownerColor)
		circle(this.x, this.y, this.d)

		ownerColor.setAlpha(50);
		fill(ownerColor);
		for(let i = 0; i < this.tail.length; i++){
			let d = this.d - ( (this.tail.length - i)/10 ) > 1 ? this.d-((this.tail.length - i)/10) : 1;
			circle(this.tail[i].x, this.tail[i].y, d);
		}
		fill(0)

		if(this.d > config.bullet.diameter){
			this.d -= 3;
		}else{
			this.d = config.bullet.diameter;
		}

		// Removes projectile after framesAlive has passed
		if (frameCount >= this.startFrame + config.bullet.framesAlive) {
			const projectileIndex = state.projectiles.findIndex(proj => proj === this)
			this.destroy(projectileIndex)
		}
	}

	// Uses index number to remove projectile from the game:
	destroy(index) {
		//! Out of bounds: if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
		state.projectiles.splice(index, 1)
		this.owner.ammo++
	}
}


//! Environment
class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config.environment.cellWidth
		this.walls = {
			//*top: null,
			right: null,
			bottom: null,
			//*left: null
		}
	}

	populateWalls() {
		for (const wall in this.walls) {
			const setWall = Math.random() < config.environment.wallOccurrency
			if (setWall) {
				this.walls[wall] = new Wall(this, wall)
			}
		}
	}
}

//? Try with rectangles instead of lines and maybe bind 'sides' to their coordinates?
class Wall {
	constructor(owner, side) {
		this.x1 = owner.x
		this.y1 = owner.y
		this.x2 = owner.x
		this.y2 = owner.y
		this.w = config.environment.wallWidth

		const length = owner.w
		switch (side) {
			case 'top':
				this.x2 += length
				break
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
			case 'left':
				this.y2 += length
				break
		}
	}

	show() {
		strokeWeight(this.w)
		strokeCap(PROJECT)
		stroke(41)
		line(this.x1, this.y1, this.x2, this.y2)
	}
}








//! Helper functions
function getMoveCoords(speed, direction) {
	return {
		x: speed * cos(degsToRads(direction)),
		y: speed * sin(degsToRads(direction))
	}
}

function degsToRads(deg) {
	return deg * (PI / 180)
}

function randomColor() {
	return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

function randomWallSide() {
	const sides = ['top', 'right', 'bottom', 'left']
	const index = Math.floor(Math.random() * 4)
	return sides[index]
}

function between(number, min, max, include = true) { // Does not include max, since collisions will ping for several cells
	if (include) {
		return number <= max && number >= min
	} else {
		return number < max && number > min
	}

}

function shake (element, magnitude = 5) {

  let counter = 1;
  let numberOfShakes = 15;

  let startX = 0,
      startY = 0,
      startAngle = 0;

  let magnitudeUnit = magnitude / numberOfShakes;

  //The `randomInt` helper function
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

	doshake();

  function doshake() {
    if (counter < numberOfShakes) {
      element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
      magnitude -= magnitudeUnit;

      let randomX = randomInt(-magnitude, magnitude);
      let randomY = randomInt(-magnitude, magnitude);

      element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';

      counter += 1;

      requestAnimationFrame(doshake);
    }

    if (counter >= numberOfShakes) {
      element.style.transform = 'translate(' + startX + ', ' + startY + ')';
    }
  }

};
