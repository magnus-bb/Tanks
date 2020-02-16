import Pickup from './Pickups.js'
import fx from './fx.js'
import game from './game.js'

import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters

function draw() {
	//* Canvas:
	//TODO: Canvas-class?
	p5.push()
	p5.background(config().bgColor)
	p5.stroke(config().strokeColor)
	p5.strokeWeight(config().wall.strokeWidth)
	p5.noFill()
	p5.rect(0, 0, p5.width, p5.height) // Outer walls
	p5.pop()
	// Does not loop over game logic in very first frame, as it normally would:
	if (p5.frameCount === 1) return

	//* Effects:
	fx.onFrame()

	//* Pickups:
	Pickup.spawn()

	for (const pickup of gameState().pickups) {
		pickup.onFrame()
	}

	//* Tanks (& Edges) - input and collision only:
	// Must happen before collisions, so a collision can overwrite player input
	for (const tank of gameState().tanks) {
		tank.input()

		tank.collision()

		//* Tanks & Pickups:
		for (let i = gameState().pickups.length - 1; i >= 0; i--) {
			const pickup = gameState().pickups[i]

			pickup.pickup(i, tank)
		}
	}

	//* Walls:
	for (const column of gameState().grid) {
		for (const cell of column) {

			wallLoop:
			for (const wall in cell.walls) { // for...in does not need to loop backwards 
				if (cell.walls[wall]) { // checks for existing walls only

					const wallObj = cell.walls[wall] // binds wall to the object, not the prop name //TODO: bare kald for wall?
					wallObj.onFrame()

					//* Walls & Tanks:
					for (const tank of gameState().tanks) {
						tank.collision(wallObj)
					}

					//* Walls & Projectiles:
					for (let i = gameState().projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
						const projectile = gameState().projectiles[i]

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
	for (const tank of gameState().tanks) {
		tank.onFrame() // Importantly done after input + collision handling
	}

	//* Projectiles (& Edges):
	for (let i = gameState().projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = gameState().projectiles[i]

		if (projectile.envCollision) {
			projectile.envCollision(i)
		}

		projectile.onFrame(i)

		//* Projectiles & Tanks:
		for (let j = gameState().tanks.length - 1; j >= 0; j--) {
			const tank = gameState().tanks[j]

			// Only for the projectiles that interact with tanks:
			if (projectile.tankHit) {
				// Checks (with projectile's own conditions) whether it hits a tank, and breaks out of tank loop, since it will continue the proj loop now that we removed the current proj.
				if (projectile.tankHit(i, j, tank)) break // i, j is for removing proj, tank
			}
		}
	}

	

	//* Round Conditions:
	game.onFrame()
}

export default draw
