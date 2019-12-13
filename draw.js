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
		player.checkCollision() // Automatically checks edge collisions when no args are given
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
						player.checkCollision(wallObj, wall) // Automatically checks wall collisions when args are given
					}

					for (const projectile of state.projectiles.bullets) {
						projectile.checkCollision(wallObj, wall) // Automatically checks wall collisions when args are given
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
	for (let i = state.projectiles.bullets.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const bullet = state.projectiles.bullets[i]
		bullet.checkCollision() // Automatically checks edge collisions when no args are given
		bullet.move()
		bullet.show(i) // Also removes projectile after duration
	}

	for (const trailPair of state.projectiles.trails) {
		Bullet.showTrail(trailPair)
	}


	//! FPS for performance indicator:
	let fps
	if (frameCount % 10 === 0) {
		fps = floor(getFrameRate())
	}
	fill(0)
	textSize(30)
	textAlign(CENTER, CENTER)
	text(fps, width / 2, height / 2)
}