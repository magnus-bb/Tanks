function draw() {
	//! Canvas
	background(195)
	stroke(41)
	strokeWeight(config.environment.wallWidth)
	noFill()
	rect(0, 0, width, height)

	//! Cells & Walls
	for (const cell of state.cells) {
		for (const wall in cell.walls) {
			if (cell.walls[wall]) cell.walls[wall].show()
		}
	}

	//! Players
	for (const player of state.players) {
		player.move()
		player.show()
	}

	//! Projectiles
	for (let i = state.projectiles.length - 1; i >= 0; i--) {
		const projectile = state.projectiles[i]
		projectile.move()
		projectile.show()
		projectile.destroy(i)
	}
}