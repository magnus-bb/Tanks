function draw() {

	//* Canvas:
	//TODO: Canvas-class?
	push()
	background(195)
	stroke(40)
	strokeWeight(config.wall.strokeWidth)
	noFill()
	rect(0, 0, width, height) // Outer walls
	pop()

	//* Pickups:
	Pickup.spawn()

	for (const pickup of state.pickups) {
		pickup.onFrame()
	}

	//* Tanks (& Edges) - input and collision only:
	// Must happen before collisions, so a collision can overwrite player input
	for (const tank of state.tanks) {
		tank.input()

		tank.collision()

		//* Tanks & Pickups:
		for (let i = state.pickups.length - 1; i >= 0; i--) {
			const pickup = state.pickups[i]

			pickup.pickup(i, tank)
		}
	}

	//* Walls:
	for (const column of state.grid) {
		for (const cell of column) {

			wallLoop:
			for (const wall in cell.walls) { // for...in does not need to loop backwards 
				if (cell.walls[wall]) { // checks for existing walls only

					wallObj = cell.walls[wall] // binds wall to the object, not the prop name //TODO: bare kald for wall?
					wallObj.onFrame()

					//* Walls & Tanks:
					for (const tank of state.tanks) {
						tank.collision(wallObj)
					}

					//* Walls & Projectiles:
					for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
						const projectile = state.projectiles[i]

						if (projectile.envCollision) {
							// 'Breaker' removes a wall, and then needs to continue wall-loop to not try to read same wall:
							const action = projectile.envCollision(i, wallObj)
							if (action === 'continue') {
								continue wallLoop
							}
						}
					}
				}
			}
		}
	}

	//* Tanks - updating:
	for (const tank of state.tanks) {
		tank.onFrame() // Importantly done after input + collision handling

		//TODO: REMAKE TO SOMETHING OTHER THAN EQUIPMENT IF IT NEEDS instause?
		if (tank.equipment && tank.equipment.instaUse) { // Only done if equipment present and has onFrame() (instause with CD needs to keep track of time)
			tank.equipment.instaUse()
		}
	}

	//* Projectiles (& Edges):
	for (let i = state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = state.projectiles[i]

		if (projectile.envCollision) {
			projectile.envCollision(i)
		}

		projectile.onFrame(i)

		//* Projectiles & Tanks:
		for (let j = state.tanks.length - 1; j >= 0; j--) {
			const tank = state.tanks[j]

			// Only for the projectiles that interact with tanks:
			if (projectile.tankHit) {
				// Checks (with projectile's own conditions) whether it hits a tank, and breaks out of tank loop, since it will continue the proj loop now that we removed the current proj.
				if (projectile.tankHit(i, j, tank)) break // i, j is for removing proj, tank
			}
		}
	}

	//* Effects:
	FX.onFrame()

	//* Round Conditions:
	Game.onFrame()
}