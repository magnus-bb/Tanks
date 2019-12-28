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

		// Automatically checks edge collisions when no args are given:
		const bodyAxes = tank.checkBodyCollision()
		if (bodyAxes.x || bodyAxes.y) {
			tank.handleBodyCollision(bodyAxes)
		}

		const cannonAxes = tank.checkCannonCollision()
		if (cannonAxes.x || cannonAxes.y) {
			tank.handleCannonCollision(cannonAxes)
		}

		if (tank.checkTurnCollision()) {
			tank.handleTurnCollision() // Automatically checks edge collisions when no args are given
		}
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

						// Automatically checks wall collisions when args are given:
						const bodyAxes = tank.checkBodyCollision(wallObj)
						if (bodyAxes.x || bodyAxes.y) {
							tank.handleBodyCollision(bodyAxes)
						}

						const cannonAxes = tank.checkCannonCollision(wallObj)
						if (cannonAxes.x || cannonAxes.y) {
							tank.handleCannonCollision(cannonAxes)
						}

						if (tank.checkTurnCollision(wallObj)) {
							tank.handleTurnCollision()
						}
					}

					for (const bullet of state.projectiles.bullets) {
						// Checks and handles collisions with walls:
						const bounceAxis = bullet.checkCollision(wallObj) // Automatically checks wall collisions when args are given
						if (bounceAxis.x || bounceAxis.y) {
							bullet.bounce(bounceAxis)
						}
					}
				}
			}
		}
	}

	//* Tanks - updating:
	for (const tank of state.tanks) {
		tank.move()
		tank.addTrailPoint()
		tank.turn(tank.turning) // Importantly done after .move() because of collision checking being done in the same order
		tank.show()
	}

	//* Projectiles:
	for (let i = state.projectiles.bullets.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const bullet = state.projectiles.bullets[i]

		// Checks and handles collisions with edges:
		const bounceAxis = bullet.checkCollision() // Automatically checks edge collisions when no args are given
		if (bounceAxis.x || bounceAxis.y) {
			bullet.bounce(bounceAxis)
		}

		bullet.move()
		bullet.show()
		if (bullet.duration <= 0) {
			bullet.destroy(i)
		}
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
			if (Tank.checkHit(bullet, tank)) {
				bullet.owner.owner.gotKill() // The player that owns the tank that spawned the bullet
				bullet.destroy(i)
				tank.destroy(j)

				// Goes on to next bullet, now that this one is destroyed:
				break

				//TODO: let bullet.owner ('s player) know it gets a point
			}
		}
	}

	//* Pickups
	for (const pickup of state.pickups) {
		pickup.show()
		//TODO: Collisions med tanks
	}

	//* Round Conditions
	// Begins counting down for end:
	if (state.tanks.length <= 0) { //! CHANGE TO 1 AFTER TESTING IS DONE
		Game.decreaseEndTimer()
	}
	// Checks if game should end:
	if (state.endTimer <= 0) {
		Game.end()
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