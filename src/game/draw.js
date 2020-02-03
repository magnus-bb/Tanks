// import Pickup from './Pickups.js'


// import store from '@/store'
// const p5 = store.state.p5
// const config = store.state.config
// const state = store.state.gameState

export default {
	methods: {
		draw() {
			//* Canvas:
			//TODO: Canvas-class?
			this.p5.push()
			this.p5.background(this.$store.state.config.cell.color)
			this.p5.stroke(this.$store.state.config.wall.color)
			this.p5.strokeWeight(this.$store.state.config.wall.strokeWidth)
			this.p5.noFill()
			this.p5.rect(0, 0, this.p5.width, this.p5.height) // Outer walls
			this.p5.pop()
			// Does not loop over game logic in very first frame, as it normally would:
			if (this.p5.frameCount === 1) return

			//* Pickups:
			this.Pickup.spawn()

			for (const pickup of this.state.pickups) {
				pickup.onFrame()
			}

			//* Tanks (& Edges) - input and collision only:
			// Must happen before collisions, so a collision can overwrite player input
			for (const tank of this.state.tanks) {
				tank.input()

				tank.collision()

				//* Tanks & Pickups:
				for (let i = this.state.pickups.length - 1; i >= 0; i--) {
					const pickup = this.state.pickups[i]

					pickup.pickup(i, tank)
				}
			}

			//* Walls:
			for (const column of this.state.grid) {
				for (const cell of column) {

					wallLoop:
					for (const wall in cell.walls) { // for...in does not need to loop backwards 
						if (cell.walls[wall]) { // checks for existing walls only

							const wallObj = cell.walls[wall] // binds wall to the object, not the prop name //TODO: bare kald for wall?
							wallObj.onFrame()

							//* Walls & Tanks:
							for (const tank of this.state.tanks) {
								tank.collision(wallObj)
							}

							//* Walls & Projectiles:
							for (let i = this.state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
								const projectile = this.state.projectiles[i]

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
			for (const tank of this.state.tanks) {
				tank.onFrame() // Importantly done after input + collision handling
			}

			//* Projectiles (& Edges):
			for (let i = this.state.projectiles.length - 1; i >= 0; i--) { // We have to go backwards when removing projectiles
				const projectile = this.state.projectiles[i]

				if (projectile.envCollision) {
					projectile.envCollision(i)
				}

				projectile.onFrame(i)

				//* Projectiles & Tanks:
				for (let j = this.state.tanks.length - 1; j >= 0; j--) {
					const tank = this.state.tanks[j]

					// Only for the projectiles that interact with tanks:
					if (projectile.tankHit) {
						// Checks (with projectile's own conditions) whether it hits a tank, and breaks out of tank loop, since it will continue the proj loop now that we removed the current proj.
						if (projectile.tankHit(i, j, tank)) break // i, j is for removing proj, tank
					}
				}
			}

			//* Effects:
			this.FX.onFrame()

			//* Round Conditions:
			this.Game.onFrame()
		}
	}
}
