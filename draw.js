function draw() {
	//* Canvas:
	background(195)
	stroke(40)
	strokeWeight(config.environment.wallWidth)
	noFill()
	rect(0, 0, width, height) // Outer walls

	//* Cells & Walls:
	for (const column of state.grid) {
		for (const cell of column) {
			for (let wall in cell.walls) {
				if (cell.walls[wall]) { // checks for existing walls only

					wallObj = cell.walls[wall] // binds wall to the object value, not the prop name
					wallObj.show()

					// Wall collisions:
					// for (const player of state.players) {
					// 	checkCollision(wallObj, wall)
					// }

					for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
						const projectile = state.projectiles[i]
						projectile.checkCollision(wallObj, wall)
					}
				}
			}
		}
	}

	//* Players:
	for (const player of state.players) {
		player.move() //TODO: check collisions here -> loop through walls in collision check on class
		player.show()
	}

	//* Projectiles
	for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = state.projectiles[i]
		projectile.move() //TODO: check collisions here -> loop through walls in collision check on class
		projectile.show() // Also removes projectile
	}
}