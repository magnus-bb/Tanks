//* BULLET

function Bullet(owner) {
	const props = {
		type: 'bullet',
		d: config.projectile.bullet.diameter,
		duration: config.projectile.bullet.duration,
		// For knowing when to stop rendering trail:
		dead: false
	}

	return {
		...props,
		...Projectile.mixins.hasBaseProps(props.type, owner),
		...Projectile.mixins.canMoveStandard(),
		...Projectile.mixins.canBounce(),
		...Projectile.mixins.canHitTank(),

		// Per-projectile environment collision handling (uses common wall/edge checks):
		envCollision(i, wall = null) { // Index is passed with all projectiles, since some need it to remove() (but not this one)
			const bounceAxis = wall ? this._checkWallCollision(wall) : this._checkEdgeCollision() // Automatically checks wall collisions when args are given

			if (bounceAxis.x || bounceAxis.y) {
				this._bounce(bounceAxis)
			}
		},

		// Makes a trail point for each frame:
		_makeTrailPoint() { //TODO: Move to mixin, if other projectiles should do this
			const trails = state.fx.bulletTrails // Trails are made in state to allow for continuous rendering when bullet is destroyed

			// When first point is made, the bullet's trail has to be initiated:
			if (!trails.has(this)) {
				trails.set(this, [])
			}

			const trail = state.fx.bulletTrails.get(this)

			trail.push({ x: this.x, y: this.y })
		},

		_show() {
			// Drawn diameter is increased in first few frames for a muzzle effect:
			let drawDiameter = this.d * config.fx.muzzleSize - (config.projectile.bullet.duration - this.duration) * config.fx.muzzleSpeed
			drawDiameter = drawDiameter > this.d ? drawDiameter : this.d

			push()

			noStroke()
			// Resets alpha on normal bullets, since it carries over from trail:
			if (this.owner.stealthedAmmo) {
				this.color.setAlpha(config.modifier.stealthAmmo.alpha)
			} else {
				this.color.setAlpha(255)
			}
			fill(this.color)
			circle(this.x, this.y, drawDiameter)

			pop()
		},

		// Trails and ammo make this _destroy() different from other projectiles:
		_destroy(i) {
			this.dead = true // For trails effect //TODO: Add to trail mixin, if other projectiles should make trails

			state.projectiles.splice(i, 1)

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

function M82Bullet(owner) {
	const props = {
		type: 'm82',
		d: 3, // Max width of projectile shape //TODO: calculated?
		penetratedWall: null,
	}

	return {
		...props,
		...Projectile.mixins.hasBaseProps(props.type, owner),
		...Projectile.mixins.canMoveStandard(),
		...Projectile.mixins.canCheckEnv(),
		...Projectile.mixins.canHitTank(),
		...Projectile.mixins.canDestroySelf(),

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
				this.speed /= config.projectile.m82.penetrationSpeedDivisor

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
			push()

			translate(this.x, this.y)
			rotate(this.direction)
			this._projectileShape(this.owner.stealthedAmmo)

			pop()
		},

		_projectileShape(stealth = false) {
			noStroke()
			stealth ? this.color.setAlpha(config.modifier.stealthAmmo.alpha * config.projectile.m82.stealthModifier) : this.color.setAlpha(255)
			fill(this.color)

			// Centering based on half the width / height of the drawing (use figma):
			translate(-3, -1.5) //TODO: Calculate?

			// Actual vector shape:
			beginShape()
			vertex(1.5, 0)
			vertex(0, 1)
			vertex(0, 2)
			vertex(1.5, 3)
			vertex(3, 3)
			vertex(6, 1.5)
			vertex(3, 0)
			vertex(1.5, 0)
			endShape(CLOSE)
		},

		onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
			this._move()
			this._show()
			this._updateNext()
		},
	}
}


//* BREAKER

function BreakerBullet(owner) {
	const props = {
		type: 'breaker',
		d: 3, // Max width of projectile shape //TODO: calculated?
	}

	return {
		...props,
		...Projectile.mixins.hasBaseProps(props.type, owner),
		...Projectile.mixins.canMoveStandard(),
		...Projectile.mixins.canCheckEnv(),
		...Projectile.mixins.canHitTank(),
		...Projectile.mixins.canDestroySelf(),

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
			push()

			translate(this.x, this.y)
			rotate(this.direction)
			this._projectileShape(this.owner.stealthedAmmo)

			pop()
		},

		_projectileShape(stealth = false) {
			noStroke()
			stealth ? this.color.setAlpha(config.modifier.stealthAmmo.alpha) : this.color.setAlpha(255)
			fill(this.color)

			// Centering based on half the width / height of the drawing (use figma):
			translate(-5, -5) //TODO: Calculate?

			// Actual vector shape:
			beginShape()
			vertex(10, 8.33333)
			vertex(6.66667, 10)
			vertex(1.66667, 8.33333)
			vertex(0, 6.66667)
			vertex(0, 3.33333)
			vertex(1.66667, 1.66667)
			vertex(6.66667, 0)
			vertex(10, 1.66667)
			vertex(10, 8.33333)
			endShape(CLOSE)
		},

		onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
			this._move()
			this._show()
			this._updateNext()
		}
	}
}


//* COMPOSITIONAL MIXINS

class Projectile {
	//! Not needed when not loading assets
	//? static types = [ 
	//? 	'm82',
	//? 	'breaker',
	//? ]

	static mixins = {
		hasBaseProps(type, owner) {
			const speed = config.projectile[type].speed
			const move = getOffsetPoint(speed, owner.direction)
			const x = owner.cannon.x
			const y = owner.cannon.y

			return {
				owner,
				x,
				y,
				speed,
				color: color(owner.color),
				direction: owner.direction,
				moveCoords: {
					dX: move.x,
					dY: move.y
				},
				next: { // Is updated every frame (in canMoveStandard()) (since a getter would recalc every wall * frame etc)
					x: x + move.x,
					y: y + move.y
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
					this.next = {
						x: this.x + this.moveCoords.dX,
						y: this.y + this.moveCoords.dY
					}
				}
			}
		},

		canCheckEnv() {
			return {
				_checkWallCollision(wall) { // 'wall' can be passed as null, if we are checking edges
					const wallRect = getWallRect(wall)

					// Looks at "all" positions between location and (fraction of) 'next' location:
					for (let step = 0; step <= this.speed; step += config.wall.collisionStepSize) {

						// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
						const next = {
							x: this.x + this.moveCoords.dX * (step / this.speed),
							y: this.y + this.moveCoords.dY * (step / this.speed)
						}

						if (pointInRect({ x: next.x, y: next.y }, wallRect)) {
							return true // NOTHING (not even false) may be returned if !pointInRect, since this stops looping
						}
					}
				},

				_checkEdgeCollision() {
					// outOfBounds() always returns object (truthy) to also get an axis, even though just true/false is used here:
					const { x, y } = outOfBounds(this.next.x, this.next.y)

					if (x || y) {
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

					if (pointInRect({ x: this.next.x, y: this.y }, wallRect)) {
						bounce.x = true
					}

					if (pointInRect({ x: this.x, y: this.next.y }, wallRect)) {
						bounce.y = true
					}

					// If values are truthy will be checked in collision()
					return bounce
				},

				_checkEdgeCollision() {
					const bounce = {
						x: false,
						y: false
					}

					const out = outOfBounds(this.next.x, this.next.y)

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
					// Distance between center of tank and proj:
					const distance = dist(this.x, this.y, tank.x, tank.y)

					// Checks if distance is smaller, when width of tank and bullet have been factored in:
					return distance < this.d / 2 + tank.d / 2
				},

				_handleHit(index, tank) {
					this.owner.owner.gotKill(tank) // The player that owns the tank that spawned the bullet
					this._destroy(index)
				}
			}
		},

		canDestroySelf() { //TODO: Add 'dead' functionality if trails are on more projectiles
			return {
				_destroy(i) {
					state.projectiles.splice(i, 1)
				}
			}
		},
	}
}