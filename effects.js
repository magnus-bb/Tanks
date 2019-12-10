console.log('Effects')
function shake(magnitude = config.effects.defaultShakeMagnitude) {
	let shakeCount = 1;
	const numShakes = 10
	const startX = 0
	const startY = 0
	const magnitudeUnit = magnitude / numShakes

	doShake = () => {
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