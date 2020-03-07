import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters

const fx = {
	shake(magnitude = config().fx.shakeMagnitude) {
		let shakeCount = 1;
		const numShakes = 10
		const startX = 0
		const startY = 0
		const magnitudeUnit = magnitude / numShakes

		const doShake = () => {
			if (shakeCount < numShakes) {
				p5.canvas.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)'
				magnitude -= magnitudeUnit

				const randomX = p5.random(-magnitude, magnitude + 1)
				const randomY = p5.random(-magnitude, magnitude + 1)

				p5.canvas.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)'

				shakeCount += 1

				requestAnimationFrame(doShake)
			}

			if (shakeCount >= numShakes) {
				p5.canvas.style.transform = 'translate(' + startX + ', ' + startY + ')'
			}
		}
		doShake()
	},

	_showBulletTrails() { // Trailpair couples bullet to trail, since bullet cannot house trail itself after it is destroyed

		for (const trailPair of gameState().fx.bulletTrails) {
			const bullet = trailPair[0]
			const trail = trailPair[1]

			if (trail.length <= 0 && bullet.dead) {
				// Removes trail, when all points have run out:
				store.commit('deleteBulletTrail', bullet)
		
			} else {
				// Keeps the trail from growing forever:
				if (trail.length > config().fx.bulletTrail.length) {
					trail.shift()
				}

				p5.push()

				p5.blendMode(p5.ADD)

				const drawColor = p5.color(bullet.color.levels) // Copies owner color instead of referencing the object
				drawColor.setAlpha(config().fx.bulletTrail.alpha) // Lower opacity than bullet

				p5.fill(drawColor)
				p5.noStroke()

				for (let i = 0; i < trail.length; i++) {
					// Lerp returns a diameter between 3 px and bullet diameter according to how close to the bullet the point is
					const d = p5.lerp(3, bullet.d, i / (trail.length - 1))

					p5.circle(trail[i].x, trail[i].y, d)
				}

				p5.pop()

				if (bullet.dead === true) {
					trail.shift()
				}
			}
		}
	},

	// _particles() {
	// 	for (const particle of gameState().fx.particles.array) {
	// 		particle.onFrame()
	// 	}
	// },

	// Particle: function() {
	// 	return {
	// 		pos: p5.createVector(p5.random(p5.width), p5.random(p5.height)),
	// 		d: config().fx.particle.diameter,
	// 		vel: p5.createVector(p5.random(-config().fx.particle.velocity, config().fx.particle.velocity), p5.random(-config().fx.particle.velocity, config().fx.particle.velocity)),
	// 		color: p5.color(config().fx.particle.color),

	// 		_edges() {
	// 			if (this.pos.x < 0) {
	// 				this.pos.x += p5.width
	// 			} else if (this.pos.x > p5.width) {
	// 				this.pos.x -= p5.width
	// 			} else if (this.pos.y < 0) {
	// 				this.pos.y += p5.height
	// 			} else if (this.pos.y > p5.height) {
	// 				this.pos.y -= p5.height
	// 			}
	// 		},

	// 		_connections() {
	// 			for (const particle of gameState().fx.particles.array) {
	// 				const distance = p5.dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)

	// 				if (this !== particle && distance <= config().fx.particle.connection.distance) {
						
	// 					p5.push()

	// 					p5.blendMode(p5.LIGHTEST)
	// 					p5.strokeWeight(config().fx.particle.connection.width)
	// 					p5.stroke(config().fx.particle.connection.color)
	// 					p5.line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)

	// 					p5.pop()
	// 				}
	// 			}
	// 		},

	// 		_show() {
	// 			p5.push()
				
	// 			p5.blendMode(p5.ADD)
				
	// 			p5.noStroke()
	// 			p5.fill(this.color)
	// 			p5.circle(this.pos.x, this.pos.y, this.d)
				
	// 			p5.pop()
	// 		},

	// 		onFrame() {
	// 			this.pos.add(this.vel)
	// 			this._edges()
	// 			this._connections()
	// 			this._show()
	// 		},
	// 	}
	// },
	
	onFrame() {
		this._showBulletTrails()

		// if (gameState().fx.particles.array.length === 0) {
		// 	for (let i = 0; i < config().fx.particle.amt; i++) {
		// 		store.commit('addParticle', new this.Particle)
		// 	}
		// }
		
		// if (gameState().ending) this._particles()
	}
}

export default fx