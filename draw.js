function draw() {
	//! Environment
	background(155)

	//! Players
	for(let player of state.players) {
		player.move()
		player.show()
	}
}