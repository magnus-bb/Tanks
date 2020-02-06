import { getOffsetPoint, outOfBounds, pointInRect, getWallRect, getDirection } from './helpers.js'

import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters



//* BULLET

export function Bullet(owner) {
	const props = {
		type: 'bullet',
		d: config().projectile.bullet.diameter,
		duration: config().projectile.bullet.duration,
		dead: false // For knowing when to stop rendering trail
	}

	return {
		...props,
		...mixins.hasBaseProps(props.type, owner),
		...mixins.canMoveStandard(),
		...mixins.canBounce(),
		...mixins.canHitTank(),

		// Per-projectile environment collision handling (uses common wall/edge checks):
		envCollision(i, wall = null) { // Index is passed with all projectiles, since some need it to remove() (but not this one)
			const bounce = wall ? this._checkWallCollision(wall) : this._checkEdgeCollision()

			if (bounce) {
				this._bounce(bounce)
			}
		},

		// Makes a trail point for each frame:
		_makeTrailPoint() { //TODO: Move to mixin, if other projectiles should do this
			// Trails are initialized in state (not on bullet) to allow for continuous rendering when bullet is destroyed

			// When first point is made, the bullet's trail has to be initialized:
			if (!gameState().fx.bulletTrails.has(this)) {
				store.commit('createBulletTrailArray', this)
				// trails.set(this, []) //TODO: Mutation
			}

			// const self = this
			// This needs to be passed as well, so Vuex knows which bullet to add the point to:
			store.commit('addBulletTrailPoint', {
				x: this.x,
				y: this.y,
				bullet: this
			})

			// const trail = gameState().fx.bulletTrails.get(this)

			// trail.push({ x: this.x, y: this.y }) //TODO: Mutation
		},

		_show() {
			// Drawn diameter is increased in first few frames for a muzzle effect:
			let drawDiameter = this.d * config().fx.muzzle.size - (config().projectile.bullet.duration - this.duration) * config().fx.muzzle.speed
			drawDiameter = drawDiameter > this.d ? drawDiameter : this.d

			p5.push()

			p5.noStroke()

			// Alpha should not be permanent when creating bullet, since this should change back and forth mid-shot:
			this.owner.stealthedAmmo ? this.color.setAlpha(config().modifier.stealthAmmo.alpha) : this.color.setAlpha(255)

			p5.fill(this.color)

			p5.circle(this.x, this.y, drawDiameter)

			p5.pop()
		},

		// Trails and ammo make this _destroy() different from other projectiles:
		_destroy(i) {
			this.dead = true // For trails effect //TODO: Add to trail mixin, if other projectiles should make trails

			store.commit('removeProjectile', i)

			// gameState().projectiles.splice(i, 1) //TODO: Mutation

			this.owner.ammo++
		},

		// Called once every frame:
		onFrame(i) {
			this._move()
			if (!this.owner.stealthedAmmo) this._makeTrailPoint() // No trail on stealthed bullets
			this._show()
			this._updateNext()

			this.duration--

			if (this.duration <= 0) {
				this._destroy(i)
			}
		}
	}
}


//* M82

export function M82(owner) {
	const props = {
		type: 'm82',
		d: 3, // Max width of projectile shape //TODO: calculated?
		penetratedWall: null,
	}

	return {
		...props,
		...mixins.hasBaseProps(props.type, owner),
		...mixins.canMoveStandard(),
		...mixins.canCheckEnv(),
		...mixins.canHitTank(),
		...mixins.canDestroySelf(),

		// Per-projectile environment collision handling (uses common wall/edge checks):
		envCollision(i, wall = null) { // Wall is not passed when checking edge collisions

			const collision = wall ? this._checkWallCollision(wall) && !this._penetration(wall) : this._checkEdgeCollision()

			if (collision) {
				this._destroy(i)
			}
		},

		_penetration(wall) {
			// First collision with a wall: 
			if (!this.penetratedWall) {

				// Saves the wall:
				this.penetratedWall = wall

				// Reduces speed:
				this.speed /= config().projectile.m82.penetrationSpeedDivisor

				// Recalculates moveCoords based on new speed:
				const { x, y } = getOffsetPoint(this.speed, this.direction)
				this.moveCoords = {
					dX: x,
					dY: y
				}

				// Returns true to not call .destroy() (pass through wall) in .collision():
				return true
			} else {
				// If there is a saved wall already, pass through if the wall is the same (if we have not gone all the way through wall yet), otherwise .destroy():
				return wall === this.penetratedWall
			}
		},

		_show() {
			p5.push()

			p5.translate(this.x, this.y)
			p5.rotate(this.direction)
			this._projectileShape(this.owner.stealthedAmmo)

			p5.pop()
		},

		_projectileShape(stealth) {
			p5.push()

			p5.noStroke()
			stealth ? this.color.setAlpha(config().modifier.stealthAmmo.alpha * config().projectile.m82.stealthModifier) : this.color.setAlpha(255)
			p5.fill(this.color)

			// Centering based on half the width / height of the drawing (use figma):
			p5.translate(-3, -1.5) //TODO: Calculate?

			// Actual vector shape:
			p5.beginShape()
			p5.vertex(1.5, 0)
			p5.vertex(0, 1)
			p5.vertex(0, 2)
			p5.vertex(1.5, 3)
			p5.vertex(3, 3)
			p5.vertex(6, 1.5)
			p5.vertex(3, 0)
			p5.vertex(1.5, 0)
			p5.endShape(p5.CLOSE)

			p5.pop()
		},

		onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
			this._move()
			this._show()
			this._updateNext()
		},
	}
}


//* BREAKER

export function Breaker(owner) {
	const props = {
		type: 'breaker',
		d: 3, // Max width of projectile shape //TODO: calculated?
	}

	return {
		...props,
		...mixins.hasBaseProps(props.type, owner),
		...mixins.canMoveStandard(),
		...mixins.canCheckEnv(),
		...mixins.canHitTank(),
		...mixins.canDestroySelf(),

		// Per-projectile environment collision handling (uses common wall/edge checks):
		envCollision(i, wall = null) { // Wall is not passed when checking edge collisions //TODO: Make separate functions for edge / wall
			if (wall && this._checkWallCollision(wall)) {
				this._breakWall(wall)

				//TODO: Blast zone behind wall

				this._destroy(i)
				return 'continue'

			} else if (this._checkEdgeCollision()) {
				this._destroy(i)
				return 'continue'
			}
		},

		_breakWall(wall) {
			wall.destroy()
		},

		_show() {
			p5.push()

			p5.translate(this.x, this.y)
			p5.rotate(this.direction)
			this._projectileShape(this.owner.stealthedAmmo)

			p5.pop()
		},

		_projectileShape(stealth) {
			p5.noStroke()
			stealth ? this.color.setAlpha(config().modifier.stealthAmmo.alpha) : this.color.setAlpha(255)
			p5.fill(this.color)

			// Centering based on half the width / height of the drawing (use figma):
			p5.translate(-5, -5) //TODO: Calculate?

			// Actual vector shape:
			p5.beginShape()
			p5.vertex(10, 8.33333)
			p5.vertex(6.66667, 10)
			p5.vertex(1.66667, 8.33333)
			p5.vertex(0, 6.66667)
			p5.vertex(0, 3.33333)
			p5.vertex(1.66667, 1.66667)
			p5.vertex(6.66667, 0)
			p5.vertex(10, 1.66667)
			p5.vertex(10, 8.33333)
			p5.endShape(p5.CLOSE)
		},

		onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
			this._move()
			this._show()
			this._updateNext()
		}
	}
}


//* COMPOSITIONAL MIXINS


const mixins = {

	hasBaseProps(type, owner) {
		const speed = config().projectile[type].speed
		const move = getOffsetPoint(speed, owner.direction)
		const x = owner.cannon.x
		const y = owner.cannon.y
		const next = [] // Populates the first lookaheads:
		for (let step = 0; step <= speed; step += (speed < config().wall.collisionStepSize ? speed : config().wall.collisionStepSize)) { // Only makes fractional lookaheads of speed if speed is more than walls' width

			// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
			next.push({
				x: x + move.x * (step / speed),
				y: y + move.y * (step / speed)
			})
		}

		return {
			owner,
			x,
			y,
			speed,
			next, // Is updated every frame (since a getter would recalc every wall * frame etc)
			color: p5.color(owner.color.levels), // Copies owner color instead of referencing the object
			direction: owner.direction,
			moveCoords: {
				dX: move.x,
				dY: move.y
			}
		}
	},

	canMoveStandard() {
		return {
			_move() {
				this.x += this.moveCoords.dX
				this.y += this.moveCoords.dY
			},

			_updateNext() {
				this.next = []

				// Looks at "all" positions between location and (fraction of) 'next' location:
				for (let step = 0; step <= this.speed; step += (this.speed < config().wall.collisionStepSize ? this.speed : config().wall.collisionStepSize)) { // Only makes fractional lookaheads of speed if speed is more than walls' width

					// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
					this.next.push({
						x: this.x + this.moveCoords.dX * (step / this.speed),
						y: this.y + this.moveCoords.dY * (step / this.speed)
					})
				}
			}
		}
	},

	// Does not return axes, just true / false if wall / edge has been hit
	canCheckEnv() {
		return {
			_checkWallCollision(wall) { // 'wall' can be passed as null, if we are checking edges
				const wallRect = getWallRect(wall)

				// uses fractional lookaheads:
				for (const step of this.next) {

					if (pointInRect({ x: step.x, y: step.y }, wallRect)) {
						return true // NOTHING (not even false) may be returned if !pointInRect, since this stops looping
					}
				}
			},

			_checkEdgeCollision() {
				// outOfBounds() always returns object (truthy) to also get an axis, even though just true/false is used here:
				const out = outOfBounds(this.next[this.next.length - 1]) // Only needs to check one point, not steps

				if (out.x || out.y) {
					return true // NOTHING (not even false) may be returned if !x || !y, since this stops looping
				}
			}
		}
	},

	canBounce() { //TODO: Separate checks and bounce if other handling should be added, that has to be integrated into checks
		return {
			_checkWallCollision(wall) {
				const bounce = {
					x: false,
					y: false
				}

				const wallRect = getWallRect(wall)

				// Uses fractional lookaheads:
				for (const step of this.next) {

					if (pointInRect({ x: step.x, y: this.y }, wallRect)) {
						bounce.x = true
					}

					if (pointInRect({ x: this.x, y: step.y }, wallRect)) {
						bounce.y = true
					}

					// Cannot return anything if falsy! (will break further checking / looping):
					if (bounce.x || bounce.y) {
						return bounce
					}
				}
			},

			_checkEdgeCollision() {
				const bounce = {
					x: false,
					y: false
				}

				const out = outOfBounds(this.next[this.next.length - 1]) // Only needs to check one point, not steps

				if (out.x) {
					bounce.x = true
				}

				if (out.y) {
					bounce.y = true
				}

				// If values are truthy will be checked in collision()
				return bounce
			},

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
		}
	},

	//TODO: Move handling of hit to separate when projectile calls for it
	canHitTank() {
		return {
			tankHit(selfIndex, tankIndex, tankObj) {
				// Stealthed projectiles cannot hit self:
				if (this.owner.stealthedAmmo && this.owner === tankObj) return


				if (this._checkHit(tankObj)) {
					this._handleHit(selfIndex, tankObj)
					tankObj.handleHit(tankIndex)

					return true // Used to break out of tank-loop in draw
				}
			},

			_checkHit(tank) {
				//TODO: Add steps if projectile speeds can exceed tank.d (20) + this.d (~3), but make it as small as possible
				// Distance between center of tank and proj:
				const distance = p5.dist(this.x, this.y, tank.x, tank.y)

				// Checks if distance is smaller, when width of tank and bullet have been factored in:
				if (distance < this.d / 2 + tank.d / 2) {
					return true
				}
			},

			_handleHit(index, tank) {
				this.owner.owner.gotKill(tank) // The player that owns the tank that spawned the bullet
				this._destroy(index)
			}
		}
	},

	canDestroySelf() { //TODO: Add 'dead' functionality to this mixin if trails are on more projectiles than just standard bullet
		return {
			_destroy(i) {
				store.commit('removeProjectile', i)
				// gameState().projectiles.splice(i, 1) //TODO: Mutation
			}
		}
	},
}