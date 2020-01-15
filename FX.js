class FX {

	static shake(magnitude = Config.current.fx.defaultShakeMagnitude) {
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
	}

	static _showBulletTrails() { // Trailpair couples bullet to trail, since bullet cannot house trail itself after it is destroyed

		for (const trailPair of state.fx.bulletTrails) {
			const bullet = trailPair[0]
			const trail = trailPair[1]

			if (trail.length <= 0 && bullet.dead) {
				// Removes trail, when all points have run out:
				state.fx.bulletTrails.delete(bullet)
			} else {
				// Keeps the trail from growing forever:
				if (trail.length > Config.current.fx.bulletTrailLength) {
					trail.shift()
				}

				push()

				bullet.color.setAlpha(Config.current.fx.bulletTrailAlpha) // Lower opacity than bullet)
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

	static onFrame() {
		this._showBulletTrails()
	}
}