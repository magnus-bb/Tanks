function draw() {
	//* Canvas
	background(195)
	stroke(40)
	strokeWeight(config.environment.wallWidth)
	noFill()
	rect(0, 0, width, height) // Outer walls

	//* Cells & Walls
	for (const column of state.grid) {
		for (const cell of column) {
			for (const wall in cell.walls) {
				if (cell.walls[wall]) cell.walls[wall].show()
			}
		}
	}

	//* Players
	for (const player of state.players) {
		player.checkCollision()
		player.move()
		player.show()
	}

	//* Projectiles
	for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = state.projectiles[i]
		projectile.checkCollision()
		projectile.move()
		projectile.show() // Also removes projectile
	}
}