export default FX = {
	shake(magnitude = config.fx.shakeMagnitude) {
		let shakeCount = 1;
		const numShakes = 10
		const startX = 0
		const startY = 0
		const magnitudeUnit = magnitude / numShakes

		const doShake = () => {
			if (shakeCount < numShakes) {
				canvas.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)'
				magnitude -= magnitudeUnit

				const randomX = random(-magnitude, magnitude + 1)
				const randomY = random(-magnitude, magnitude + 1)

				canvas.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)'

				shakeCount += 1

				requestAnimationFrame(doShake)
			}

			if (shakeCount >= numShakes) {
				canvas.style.transform = 'translate(' + startX + ', ' + startY + ')'
			}
		}
		doShake()
	},

	_showBulletTrails() { // Trailpair couples bullet to trail, since bullet cannot house trail itself after it is destroyed

		for (const trailPair of state.fx.bulletTrails) {
			const bullet = trailPair[0]
			const trail = trailPair[1]

			if (trail.length <= 0 && bullet.dead) {
				// Removes trail, when all points have run out:
				state.fx.bulletTrails.delete(bullet)
			} else {
				// Keeps the trail from growing forever:
				if (trail.length > config.fx.bulletTrail.length) {
					trail.shift()
				}

				push()

				blendMode(ADD)

				const drawColor = color(bullet.color.levels) // Copies owner color instead of referencing the object
				drawColor.setAlpha(config.fx.bulletTrail.alpha) // Lower opacity than bullet

				fill(drawColor)
				noStroke()

				for (let i = 0; i < trail.length; i++) {
					// Lerp returns a diameter between 3 px and bullet diameter according to how close to the bullet the point is
					const d = lerp(3, bullet.d, i / (trail.length - 1))

					circle(trail[i].x, trail[i].y, d)
				}

				pop()

				if (bullet.dead === true) {
					trail.shift()
				}
			}
		}
	},

	_particles() {
		if (state.fx.particles.array.length === 0) {
			for (let i = 0; i < config.fx.particle.amt; i++) {
				state.fx.particles.array.push(new this.Particle())
			}
		}

		for (const particle of state.fx.particles.array) {
			particle.onFrame()
		}
	},

	Particle: function() {
		return {
			pos: createVector(random(width), random(height)),
			d: config.fx.particle.diameter,
			vel: createVector(random(-config.fx.particle.velocity, config.fx.particle.velocity), random(-config.fx.particle.velocity, config.fx.particle.velocity)),
			color: color(config.fx.particle.color),

			_edges() {
				if (this.pos.x < 0) {
					this.pos.x += width
				} else if (this.pos.x > width) {
					this.pos.x -= width
				} else if (this.pos.y < 0) {
					this.pos.y += height
				} else if (this.pos.y > height) {
					this.pos.y -= height
				}
			},

			_connections() {
				for (const particle of state.fx.particles.array) {
					const distance = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)

					if (this !== particle && distance <= config.fx.particle.connection.distance) {
						
						push()

						blendMode(LIGHTEST)
						strokeWeight(config.fx.particle.connection.width)
						stroke(config.fx.particle.connection.color)
						line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)

						pop()
					}
				}
			},

			_show() {
				push()
				
				blendMode(ADD)
				
				noStroke()
				fill(this.color)
				circle(this.pos.x, this.pos.y, this.d)
				
				pop()
			},

			onFrame() {
				this.pos.add(this.vel)
				this._edges()
				this._connections()
				this._show()
			},
		}
	},
	
	onFrame() {
		this._showBulletTrails()
		if (state.fx.particles.on) this._particles()
	}
}