function draw() {
	//* Canvas:
	background(195)
	stroke(40)
	strokeWeight(config.env.wallStroke)
	noFill()
	rect(0, 0, width, height) // Outer walls

	//* Tanks - inputs + out of bounds:
	// Must happen before collisions, so a collision can overwrite player input
	for (const tank of state.tanks) {
		tank.input()

		// Checks and handles collisions with edges:
		const collision = tank.checkCollision() // Automatically checks edge collisions when no args are given
		if (collision.x || collision.y) tank.handleCollision(collision)
		
		// Checks and handles turn collisions with edges:
		if(tank.checkTurnCollision()) tank.handleTurnCollision() // Automatically checks edge collisions when no args are given
	}

	//* Cells & Walls:
	for (const column of state.grid) {
		for (const cell of column) {
			for (let wall in cell.walls) {
				if (cell.walls[wall]) { // checks for existing walls only

					wallObj = cell.walls[wall] // binds wall to the object, not the prop name
					wallObj.show()

					//* Collisions:
					for (const tank of state.tanks) {
						// Checks and handles collisions with walls:
						const collision = tank.checkCollision(wallObj) // Automatically checks wall collisions when args are given
						if (collision.x || collision.y) tank.handleCollision(collision)

						// Checks and handles turn collisions with walls:
						if (tank.checkTurnCollision(wallObj, wall)) tank.handleTurnCollision() // Automatically checks wall collisions when args are given
					}

					for (const bullet of state.projectiles.bullets) {
						// Checks and handles collisions with walls:
						const bounceAxis = bullet.checkCollision(wallObj) // Automatically checks wall collisions when args are given
						if (bounceAxis.x || bounceAxis.y) bullet.bounce(bounceAxis)
					}
				}
			}
		}
	}

	//* Tanks - updating:
	for (const tank of state.tanks) {
		tank.move()
		tank.show()
	}

	//* Projectiles:
	for (let i = state.projectiles.bullets.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const bullet = state.projectiles.bullets[i]

		// Checks and handles collisions with edges:
		const bounceAxis = bullet.checkCollision() // Automatically checks edge collisions when no args are given
		if (bounceAxis.x || bounceAxis.y) bullet.bounce(bounceAxis)

		bullet.move()
		bullet.show(i) // Also removes projectile after duration
	}

	for (const trailPair of state.projectiles.trails) {
		Bullet.showTrail(trailPair)
	}

	//* Tanks & Projectiles:
	for (let i = state.projectiles.bullets.length - 1; i >= 0; i--) {
		const bullet = state.projectiles.bullets[i]

		for (let j = state.tanks.length - 1; j >= 0; j--) {
			const tank = state.tanks[j]

			// Checks and handles bullet hits for both bullet and tank:
			Tank.checkHit(bullet, i, tank, j)
		}
	}

	if (Game.paused) {
		noLoop()
	}


	//! FPS for performance indicator:
	// let fps
	// if (frameCount % 10 === 0) {
	// 	fps = floor(getFrameRate())
	// }
	// fill(0)
	// textSize(30)
	// textAlign(CENTER, CENTER)
	// text(fps, width / 2, height / 2)
}