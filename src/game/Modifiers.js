import { getOffsetPoint, pointInRect, outOfBounds } from './helpers.js'

import store from '@/store'
const { p5 } = store.state
const { config, gameState } = store.getters


function StealthAmmo(owner, name) {
	const props = {
		owner,
		name
	}

	return {
		...props,
		...mixins.hasTimer(name),
		...mixins.canRemoveSelf(),

		_effect() {
			if (!this.owner.stealthedAmmo) {
				this.owner.stealthedAmmo = true
			}
		},

		_reset() {
			this.owner.stealthedAmmo = false
		}
	}
}

// Not pickuppable (thus not in lookup dict) - only gainable from equipment:
export function LaserSight(owner, name) {
	const props = {
		owner,
		name,
		color: p5.color(owner.color.levels) // Copies owner color instead of referencing the object
	}
	props.color.setAlpha(config().modifier.laserSight.alpha)

	return {
		...props,
		...mixins.canRemoveSelf(),

		_effect() {
			for (let dist = 0; dist < 9999; dist += config().wall.collisionStepSize) {
				// Potential end point:
				const point = getOffsetPoint(dist, owner.direction)
				const point2 = {
					x: point.x + owner.x,
					y: point.y + owner.y
				}

				for (const column of gameState().grid) {
					for (const cell of column) {
						for (const wall in cell.walls) { // for...in does not need to loop backwards 
							if (!cell.walls[wall]) continue  // checks for existing walls only

							// Takes ref to wall and calculates the rectangle:
							const wallRect = cell.walls[wall].pointRect

							// If point intersects the wall or if it is out of canvas:
							const out = outOfBounds(point2)
							if (out.x || out.y || pointInRect(point2, wallRect)) {

								const point1 = {
									x: owner.cannon.x,
									y: owner.cannon.y
								}

								// Actually shows effect:
								this._drawLaser(point1, point2)

								// Stops all further looping, since line has been drawn:
								return

							}
						}
					}
				}
			}
		},

		_drawLaser(from, to) {
			p5.push()

			p5.strokeWeight(config().modifier.laserSight.width)
			p5.stroke(this.color)

			p5.line(from.x, from.y, to.x, to.y)

			p5.pop()
		},

		_removal(i) {
			if (!owner.equipment || !config().modifier.laserSight.onEquipment.includes(owner.equipment.name)) { // Order of checks are important - cannot check equipment.name if equipment is not there
				this._remove(i)
			}
		},

		// Has own version of onFrame(), since this is not timed (etc) like a pickup
		onFrame(i) {
			this._removal(i)

			this._effect()
		}
	}
}

//* COMPOSITIONAL MIXINS

const mixins = {

	hasTimer(name) {
		return {
			duration: config().modifier[name].duration,

			onFrame(i) {
				this._effect()

				this.duration--

				if (this.duration <= 0) {
					this._remove(i)
				}
			},
		}
	},

	canRemoveSelf() {
		return {
			_remove(index) {
				if (this._reset) this._reset() // Some powerups change (permanent) state in tank (etc), that need to be reset individually by the mod (since it will not just disappear when mod disappears)

				// this.owner.modifiers.delete(this)
				this.owner.modifiers.splice(index, 1)
			}
		}
	}
}


//* LOOKUP DICTIONARY

export default {
	StealthAmmo,
}