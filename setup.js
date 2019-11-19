function setup() {
	// Makes world
	createCanvas(config.canvas.width, config.canvas.height)

	// Creates a player
	state.players.push(new Tank(
		'Magnus',
		Math.floor(Math.random() * config.canvas.width),
		Math.floor(Math.random() * config.canvas.height)
	)
	)

	state.players.push(new Tank(
		'Helena',
		Math.floor(Math.random() * config.canvas.width),
		Math.floor(Math.random() * config.canvas.height),
		'KeyW', 'KeyD', 'KeyS', 'KeyA'
	)
	)
}


//! Keyboard listeners
// Whether a key is down can be accessed in the state-object
document.addEventListener('keydown', e => {
	state.pressedKeys[e.code] = true
})
document.addEventListener('keyup', e => {
	state.pressedKeys[e.code] = false
})