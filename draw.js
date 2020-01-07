function draw() {

	//* Canvas:
	background(195)
	stroke(40)
	strokeWeight(config.env.wallStroke)
	noFill()
	rect(0, 0, width, height) // Outer walls

	//* Pickups:
	for (const pickup of state.pickups) {
		pickup.onFrame()
	}

	//* Tanks - input and collision only:
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

		//* Tanks & Pickups:
		for (let i = state.pickups.length - 1; i >= 0; i--) {
			const pickup = state.pickups[i]

			if (pickup.checkCollision(tank) && !tank.equipment) {
				pickup.pickedUp(i, tank)
			}
		}
	}

	//* Walls:
	for (const column of state.grid) {
		for (const cell of column) {
			for (let wall in cell.walls) {
				if (cell.walls[wall]) { // checks for existing walls only

					wallObj = cell.walls[wall] // binds wall to the object, not the prop name
					wallObj.show()

					//* Walls & Tanks:
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

					//* Walls & Bullets:
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
		tank.onFrame() // Importantly done after input + collision handling
		tank.equipment && tank.equipment.onFrame() // Only done if equipment present and has onFrame()
	}

	//* Projectiles:
	for (let i = state.projectiles.bullets.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const bullet = state.projectiles.bullets[i]

		// Checks and handles collisions with edges:
		const bounceAxis = bullet.checkCollision() // Automatically checks edge collisions when no args are given
		if (bounceAxis.x || bounceAxis.y) {
			bullet.bounce(bounceAxis)
		}

		bullet.onFrame(i)

		//* Projectiles & Tanks:
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

	//* Effects:
	for (const trailPair of state.projectiles.trails) {
		Bullet.showTrail(trailPair)
	}

	//* Round Conditions:

	Game.onFrame()
}