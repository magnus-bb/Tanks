function draw() {

	//* Canvas:
	//TODO: Canvas-class?
	push()

	background(195)
	stroke(40)
	strokeWeight(Config.current.wall.strokeWidth)
	noFill()
	rect(0, 0, width, height) // Outer walls

	pop()

	//* Pickups:
	Pickup.spawn()

	for (const pickup of state.pickups) {
		pickup.onFrame()
	}

	//* Tanks - input and collision only:
	// Must happen before collisions, so a collision can overwrite player input
	for (const tank of state.tanks) {
		tank.input()

		tank.collision()

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
					wallObj.onFrame()

					//* Walls & Tanks:
					for (const tank of state.tanks) {
						tank.collision(wallObj)
					}

					//* Walls & Bullets:
					for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
						const projectile = state.projectiles[i]

						// Checks and handles collisions with walls:
						projectile.collision(i, wallObj) || true // Only checks collisions if projectile has collision-interactions
					}
				}
			}
		}
	}

	//* Tanks - updating:
	for (const tank of state.tanks) {
		tank.onFrame() // Importantly done after input + collision handling
		if (tank.equipment && tank.equipment.onFrame) { // Only done if equipment present and has onFrame() (instause with CD needs to keep track of time)
			tank.equipment.onFrame()
		} 
	}

	//* Projectiles:
	for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = state.projectiles[i]

		projectile.collision(i)

		projectile.onFrame(i)

		//* Projectiles & Tanks:
		for (let j = state.tanks.length - 1; j >= 0; j--) {
			const tank = state.tanks[j]

			// Checks and handles bullet hits for both bullet and tank:
			if (Tank.checkHit(projectile, tank)) { //TODO: Pak ind i class method, á la .collision()?
				projectile.owner.owner.gotKill() // The player that owns the tank that spawned the bullet
				projectile.destroy(i)
				tank.destroy(j)

				// Goes on to next bullet, now that this one is destroyed:
				break

				//TODO: let bullet.owner ('s player) know it gets a point
			}
		}
	}

	//* Effects:
	for (const trailPair of state.fx.bulletTrails) {
		FX.showBulletTrail(trailPair)
	}

	//* Round Conditions:
	Game.onFrame()
}