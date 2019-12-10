console.log('Draw')
function draw() {
	//* Canvas:
	background(195)
	stroke(40)
	strokeWeight(config.env.wallWidth)
	noFill()
	rect(0, 0, width, height) // Outer walls

	//* Players - inputs + out of bounds:
	// Must happen before collisions, so a collision can overwrite player input
	for (const player of state.players) {
		player.input()
		player.outOfBounds()
	}

	//* Cells & Walls:
	for (const column of state.grid) {
		for (const cell of column) {
			for (let wall in cell.walls) {
				if (cell.walls[wall]) { // checks for existing walls only

					wallObj = cell.walls[wall] // binds wall to the object, not the prop name
					wallObj.show()

					//* Collisions:
					for (const player of state.players) {
						player.checkCollision(wallObj, wall)
					}

					for (const projectile of state.projectiles) {
						projectile.checkCollision(wallObj, wall)
					}
				}
			}
		}
	}

	//* Players - updating:
	for (const player of state.players) {
		player.move()
		player.show()
	}

	//* Projectiles:
	for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = state.projectiles[i]
		projectile.move()
		projectile.show(i) // Also removes projectile after duration
	}

	// for (let i = state.effects.poofs.length - 1; i >= 0; i--) {
	// 	const poof = state.effects.poofs[i]
	// 	poof.show(i) // Also removes effect after duration
	// }
}