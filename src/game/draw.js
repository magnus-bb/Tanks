import fx from './fx.js'
import Pickup from './Pickups.js'
import game from './game.js'
import { getContainingCell } from './helpers.js'

import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters


function draw() {
	// console.clear()
	// console.time('draw')

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
	for (const tank of gameState().tanks) {
		
		// Must happen before collisions, so a collision can overwrite player input:
		tank.input()

		tank.collision()


		//* Tanks & Pickups:
		for (let i = gameState().pickups.length - 1; i >= 0; i--) {
			const pickup = gameState().pickups[i]

			pickup.pickup(i, tank)
		}

		//* Tanks & Walls:

		// Only collision-checks with walls around tank:
		const cells = getContainingCell({ x: tank.x, y: tank.y }).neighborhood

		for (const cell of cells) {
			for (const wall in cell.walls) {
				tank.collision(cell.walls[wall])
			}
		}

		tank.onFrame() // Importantly done after input + collision handling
	}


	//* Walls:
	// console.time('walls')
	for (const column of gameState().grid) {
		for (const cell of column) {

			for (const wall in cell.walls) { // for...in does not need to loop backwards 

					const wallObj = cell.walls[wall] // binds wall to the object, not the prop name //TODO: bare kald for wall?
					wallObj.onFrame()
					
			}
		}
	}

	// //* Tanks - updating:
	// for (const tank of gameState().tanks) {
		// tank.onFrame() // Importantly done after input + collision handling
	// }

	//* Projectiles (& Edges):
	projectileLoop:
	for (let i = gameState().projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
		const projectile = gameState().projectiles[i]

		projectile.onFrame(i) // Before all collision-checks is important

		if (projectile.envCollision) {
			projectile.envCollision(i)
		}

		//* Projectiles & Tanks:
		for (let j = gameState().tanks.length - 1; j >= 0; j--) {
			const tank = gameState().tanks[j]

			// Only for the projectiles that interact with tanks:
			if (projectile.tankHit) {
				// Checks (with projectile's own conditions) whether it hits a tank, and breaks out of tank loop, since it will continue the proj loop now that we removed the current proj.
				if (projectile.tankHit(i, j, tank)) break // i, j is for removing proj, tank
			}
		}

		//* Projectiles & Walls:

		// Only collision-checks with walls around proj:
		const cells = getContainingCell({ x: projectile.x, y: projectile.y }).neighborhood

		for (const cell of cells) {
			for (const wall in cell.walls) {
				const wallObj = cell.walls[wall]

				// if (!wallObj) continue
				
				if (projectile.envCollision) {
					const action = projectile.envCollision(i, wallObj)

					// 'Breaker' removes a wall, and then needs to continue wall-loop to not try to read same wall:
					if (action === 'nextWall') {
						continue

						// Bouncing can make infinite loop between two walls, so we need to stop checking the same proj after the first bounce until next frame
					} else if (action === 'nextProj') {
						continue projectileLoop // Has to be done last in this loop
					}
				}
			}
		}
	}


	//* Round Conditions:
	game.onFrame()

	// console.timeEnd('draw')
}


export default draw
