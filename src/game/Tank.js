import fx from './fx.js'
import * as projectile from './Projectiles.js'
import game from './game.js'
import { hasContent, getOffsetPoint, getWallRect, pointInRect, outOfBounds, circleIntersectsEdge, circleIntersectsRect, getTurnDirection } from './helpers.js'

import store from '@/store'
const { p5 } = store.state
const { config } = store.getters

export default class Tank {
	constructor(name, colorArray, x, y, controls, owner) {
		// owner.tank = this // Sets player.tank to be this object
		store.commit('set', { target: owner.id, prop: 'tank', val: this })
		this.owner = owner
		this.name = name
		this.x = x
		this.y = y //TODO: Given a cell, calculate the center instead of giving a center coordinate
		this.d = config().tank.diameter
		this.moveSpeed = config().tank.moveSpeed
		this.turnSpeed = config().tank.turnSpeed
		this.driving = false // To look ahead before actually moving
		this.direction = p5.random(0, 360)
		this.color = p5.color(colorArray) // Array of RGB
		this.ammo = config().tank.ammo
		this.stealthedAmmo = false
		this.equipment = null
		this.modifiers = new Set()
		this.powerups = []
		this.trail = [{ x: this.x, y: this.y }] //? For death recap - maybe
		this.controls = controls
		this.moveCoords = {
			dX: 0,
			dY: 0
		}
		this.turning = 0
		
		const relCannonTip = getOffsetPoint(config().tank.cannon.length, this.direction)
		this.relCannon = {
			x: relCannonTip.x,
			y: relCannonTip.y
		}
	}
	get cannon() {
		return {
			x: this.relCannon.x + this.x,
			y: this.relCannon.y + this.y
		}
	}
	get next() { // Next tank (center) position (if no collision is observed):
		return {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}
	get r() {
		return this.d / 2
	}

	input() {
		// Forwards / backwards mobility:
		if (p5.keyIsDown(this.controls.forward)) {
			this.driving = 'forward'
		} else if (p5.keyIsDown(this.controls.backward)) {
			this.driving = 'backward'
		} else {
			this.driving = false
		}

		// Turning:
		this.turning = 0 // Resets
		if (p5.keyIsDown(this.controls.left)) {
			this.turning = -1
		}
		if (p5.keyIsDown(this.controls.right)) {
			this.turning = 1
		}

		// Angle and amount (if any) to move:
		const move = getOffsetPoint(this.moveSpeed, this.direction, this.driving)
		this.moveCoords.dX = move.x
		this.moveCoords.dY = move.y
	}

	collision(wall = null) {

		const lookAheads = {
			x: {
				x: this.next.x,
				y: this.y,
				r: this.r
			},
			y: {
				x: this.x,
				y: this.next.y,
				r: this.r
			}
		}

		// Checks collisions:
		const bodyAxes = wall ? this._checkBodyWallCollision(wall, lookAheads) : this._checkBodyEdgeCollision(lookAheads)

		const cannonAxes = wall ? this._checkCannonWallCollision(wall) : this._checkCannonEdgeCollision()

		const turn = wall ? this._checkTurnWallCollision(wall) : this._checkTurnEdgeCollision()

		// Handles collisions:
		if (bodyAxes.x || bodyAxes.y) this._handleBodyCollision(bodyAxes)

		if (cannonAxes.x || cannonAxes.y) this._handleCannonCollision(cannonAxes)

		if (turn) this._handleTurnCollision()
	}

	_checkBodyWallCollision(wall, lookAheads) {
		const collision = {
			x: false,
			y: false
		}

		const wallRect = getWallRect(wall, true)

		// Checks with a lookahead on x:
		if (circleIntersectsRect(lookAheads.x, wallRect)) {
			collision.x = true
		}

		// Checks with a lookahead on y:
		if (circleIntersectsRect(lookAheads.y, wallRect)) {
			collision.y = true
		}

		return collision
	}

	_checkBodyEdgeCollision(lookAheads) {
		const collision = {
			x: false,
			y: false
		}

		// Checks with a lookahead on x:
		if (circleIntersectsEdge(lookAheads.x)) {
			collision.x = true
		}

		// Checks with a lookahead on y:
		if (circleIntersectsEdge(lookAheads.y)) {
			collision.y = true
		}

		return collision
	}

	// Halts movement:
	_handleBodyCollision(axes) {
		if (axes.x) {
			this.moveCoords.dX = 0
			this.moveCoords.dY /= config().tank.collisionMoveSlow
		}
		if (axes.y) {
			this.moveCoords.dY = 0
			this.moveCoords.dX /= config().tank.collisionMoveSlow
		}
	}

	_checkCannonWallCollision(wall) {
		// To be returned:
		const collision = {
			x: false,
			y: false
		}

		const wallRect = getWallRect(wall)

		for (let i = this.r; i <= config().tank.cannon.length; i++) {

			// Every point on the cannon...
			const point = getOffsetPoint(i, this.direction)
			// Relative to the tank's next pos:
			const nextPoint = {
				x: point.x + this.next.x,
				y: point.y + this.next.y
			}
			// Relative to the tank:
			point.x += this.x
			point.y += this.y

			if (pointInRect({ x: nextPoint.x, y: point.y }, wallRect)) {
				collision.x = true
			}
			if (pointInRect({ x: point.x, y: nextPoint.y }, wallRect)) {
				collision.y = true
			}
		}

		return collision
	}

	_checkCannonEdgeCollision(wall) {
		// To be returned:
		const collision = {
			x: false,
			y: false
		}

		const nextCannonTip = {
			x: this.next.x + this.relCannon.x,
			y: this.next.y + this.relCannon.y
		}

		const out = outOfBounds(nextCannonTip)

		if (out.x) {
			collision.x = true
		}
		if (out.y) {
			collision.y = true
		}

		return collision
	}

	_handleCannonCollision(axes) {
		// Halts / slows movement:
		if (axes.x) {
			this.moveCoords.dX = 0
			this.moveCoords.dY /= config().tank.collisionMoveSlow
		}
		if (axes.y) {
			this.moveCoords.dX /= config().tank.collisionMoveSlow
			this.moveCoords.dY = 0
		}

		// Turns slowly, if driving forward:
		for (const axis in axes) {
			if (axes[axis] && this.driving === 'forward') {
				this._turn(this._getTurnDirection(axis, this.direction), true) // true lowers the turnspeed for collisions
			}
		}
	}

	// Returns left (-1) or right (1) based on the axis of collision and pointing direction of tank
	_getTurnDirection(collisionAxis, dir) {
		// Lower right and top left quadrant:
		if (dir.between(0, 90, false) || dir < -270 || dir.between(180, 270, false) || dir.between(-180, -90, false)) {
			return collisionAxis === 'x' ? 1 : -1

			// Lower left and top right quadrant:
		} else if (dir.between(90, 180, false) || dir.between(-270, -180, false) || dir > 270 || dir.between(-90, 0, false)) {
			return collisionAxis === 'x' ? -1 : 1
		}
	}

	_checkTurnWallCollision(wall) {
		const nextDir = (this.direction % 360) + this.turnSpeed * this.turning

		const wallRect = getWallRect(wall)

		// Starts from edge of tank, not cannon root:
		for (let i = this.r; i <= config().tank.cannon.length; i++) {

			// Every point on the cannon...
			const nextPoint = getOffsetPoint(i, nextDir)

			// Relative to the recalculated next location of the tank (since we don't want to turn and then move in the "old" direction)
			nextPoint.x += this.next.x
			nextPoint.y += this.next.y

			if (pointInRect({ x: nextPoint.x, y: nextPoint.y }, wallRect)) {
				return true
			}
		}
	}

	_checkTurnEdgeCollision() {
		const nextCannonTip = {
			x: this.next.x + this.relCannon.x,
			y: this.next.y + this.relCannon.y
		}

		const out = outOfBounds(nextCannonTip)

		if (out.x || out.y) {
			return true
		}
	}

	_handleTurnCollision() {
		this.turning = 0
	}

	fire() {
		if (this.equipment) {

			// If the item is usable:
			if (this.equipment.use) {
				this.equipment.use()

			} else {// If the item is on cooldown (e.g. wormhole) - ie the .use() method does not exist:
				console.log("You cannot use this item at the moment.")
			}

		} else if (this.ammo > 0) {
			this.ammo--

			store.commit('addProjectile', new projectile.Bullet(this))

			fx.shake() // Global effect
		}
	}

	_modifiers() {
		for (const modifier of this.modifiers) {
			modifier.onFrame()
		}
	}

	_equipment() {
		this.equipment && this.equipment.onFrame && this.equipment.onFrame()
	}

	_move() {
		// Takes collisions into consideration, since moveCoords will be updated accordingly
		if (this.driving) {
			this.x += this.moveCoords.dX
			this.y += this.moveCoords.dY
		}

		// Updates cannon coords:
		const tip = getOffsetPoint(config().tank.cannon.length, this.direction) // Same function as with moving - gets coords based on distance from center and a direction
		this.relCannon.x = tip.x
		this.relCannon.y = tip.y
	}

	// Takes -1 for left and 1 for right:
	_turn(turnDirection, bodyCollision = false) {
		if (bodyCollision) {
			// % 360 makes it so we don't have to deal with angles over 360 deg:
			this.direction = (this.direction % 360) + this.turnSpeed / config().tank.collisionTurnSlow * turnDirection //TODO: Maybe use rotate() when we switch to sprites
		} else {
			this.direction = (this.direction % 360) + this.turnSpeed * turnDirection //TODO: Maybe use rotate() when we switch to sprites
		}
	}

	// Adds a trail point if tank is not standing still:
	_addTrailPoint() {
		if (this.trail[this.trail.length - 1].x !== this.x || this.trail[this.trail.length - 1].y !== this.y) {
			this.trail.push({ x: this.x, y: this.y })
		}
	}

	_show() {
		p5.push()

		p5.stroke(config().strokeColor)
		p5.fill(this.color)

		// Renders body:
		p5.push()
		p5.strokeWeight(1)
		p5.circle(this.x, this.y, this.d)
		p5.pop()

		// Renders cannon:
		p5.push()
		p5.strokeWeight(config().tank.cannon.width)
		p5.translate(this.x, this.y)
		p5.rotate(this.direction)
		p5.line(this.d / config().tank.cannon.midOffsetDivisor, 0, config().tank.cannon.length, 0) // Straight line the length of the cannon
		p5.pop()

		p5.pop()
	}

	handleHit(index) {
		this.owner.deaths++

		this._destroy(index)
	}

	// Uses index number to remove tank from the game:
	_destroy(i) {
		store.commit('removeTank', i)

		game.tankDestroyed()
		//TODO: Msg on death or counter etc + effect
	}

	// Called every frame:
	onFrame() {
		this._move()
		this._turn(this.turning) // Importantly done after .move() because of collision checking being done in the same order

		this._addTrailPoint()
		this._show()
		this._modifiers()
		this._equipment()
	}
}