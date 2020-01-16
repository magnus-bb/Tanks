class Projectile { //TODO: LAV EN SAMLING AF GÆNGSE METODER OSV OG BRUG COMPOSITION ELLER DYNAMISKE METODER (argument til constructor sætter enten envcollisions, tank collisions eller alle)

	static projectiles = [
		'm82',
		'breaker',
	]


	//* INSTANCES
	constructor(owner) {
		this.owner = owner
	}

	tankHit(selfIndex, tankIndex, tankObj) {
		if (this._checkHit(tankObj)) {
			this._handleHit(selfIndex, tankObj)
			tankObj.handleHit(tankIndex)

			return true // Used to break out of tank-loop in draw
		}
	}

	_checkHit(tank) {
		// Distance between center of tank and proj:
		const distance = dist(this.x, this.y, tank.x, tank.y)

		// Checks if distance is smaller, when width of tank and bullet have been factored in:
		return distance < this.d / 2 + tank.d / 2
	}

	_handleHit(index, tank) {
		this.owner.owner.gotKill(tank) // The player that owns the tank that spawned the bullet
		this._destroy(index)
	}
}

//* BULLET
class Bullet extends Projectile {
	constructor(owner, stealth = false) {
		super(owner)

		this.type = stealth ? 'stealthBullet' : 'bullet'
		this.stealthed = stealth
		this.d = Config.current.bullet.diameter // Initial size is bigger for a muzzle flash effect
		this.direction = owner.direction
		this.speed = Config.current.bullet.speed
		this.x = this.owner.cannon.x
		this.y = this.owner.cannon.y
		this.duration = Config.current.bullet.duration
		this.color = stealth ? color(0, 0, 0, Config.current.equipment.stealthBullets.alpha) : color(this.owner.color) // Must convert to P5-color object to be able to set alpha dynamically (back and forth with trail fx)
		const move = getOffsetPoint(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}
		this.next = { // Updated every frame instead of getter (that runs in too many loops)
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}

		// For knowing when to stop rendering trail:
		this.dead = false
	}

	envCollision(i, wall = null) { // Index is passed with all projectiles, since some need it to remove() (but not this one)
		const bounceAxis = wall ? this._checkWallCollision(wall) : this._checkEdgeCollision() // Automatically checks wall collisions when args are given

		if (bounceAxis.x || bounceAxis.y) {
			this._bounce(bounceAxis)
		}
	}

	_checkWallCollision(wall) {
		const bounce = {
			x: false,
			y: false
		}

		const wallRect = getWallRect(wall)

		if (pointInRect({ x: this.next.x, y: this.y }, wallRect)) {
			bounce.x = true
		}

		if (pointInRect({ x: this.x, y: this.next.y }, wallRect)) {
			bounce.y = true
		}

		// If values are truthy will be checked in collision()
		return bounce
	}

	_checkEdgeCollision() {
		const bounce = {
			x: false,
			y: false
		}

		const out = outOfBounds(this.next.x, this.next.y)

		if (out.x) {
			bounce.x = true
		}

		if (out.y) {
			bounce.y = true
		}

		// If values are truthy will be checked in collision()
		return bounce
	}

	_bounce(axis) {
		// Reverses move direction of the axis:
		if (axis.x) {
			this.moveCoords.dX *= -1
		}
		if (axis.y) {
			this.moveCoords.dY *= -1
		}

		// Updates direction to match the new moveCoords:
		this.direction = getDirection(this.moveCoords.dX, this.moveCoords.dY)
	}

	_move() {
		// Moves bullet:
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	// Makes a trail point for each frame:
	_makeTrailPoint() {
		const trails = state.fx.bulletTrails // Trails are made in state to allow for continuous rendering when bullet is destroyed

		// When first point is made, the bullet's trail has to be initiated:
		if (!trails.has(this)) {
			trails.set(this, [])
		}

		const trail = state.fx.bulletTrails.get(this)

		trail.push({ x: this.x, y: this.y })
	}

	_show() {

		// Drawn diameter is increased in first few frames for a muzzle effect:
		let drawDiameter = this.d * Config.current.fx.muzzleSize - (Config.current.bullet.duration - this.duration) * Config.current.fx.muzzleSpeed
		drawDiameter = drawDiameter > this.d ? drawDiameter : this.d

		push()

		noStroke()
		// Resets alpha on normal bullets, since it carries over from trail:
		if (!this.stealthed) this.color.setAlpha(255)
		fill(this.color)
		circle(this.x, this.y, drawDiameter)

		pop()
	}

	_updateNext() {
		this.next = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	_destroy(i) {
		this.dead = true // For trails effect

		state.projectiles.splice(i, 1)

		this.owner.ammo++
	}

	// Called once every frame:
	onFrame(i) {
		this._move()
		if (!this.stealthed) this._makeTrailPoint()
		this._show()
		this._updateNext()

		this.duration--

		if (this.duration <= 0) {
			this._destroy(i)
		}
	}
}


//* M82
class M82Bullet extends Projectile {
	constructor(owner) {
		super(owner)

		this.type = 'm82'
		this.asset = assets.projectiles[this.type]
		// A circle with diameter the width of the projectile image will be good enough:
		this.d = this.asset.height // To make p5-rotate work normally, all images must be on their side, hence: width of projectile is height of image
		this.direction = owner.direction
		this.speed = Config.current.equipment.m82.speed
		this.x = this.owner.cannon.x
		this.y = this.owner.cannon.y
		//!this.color = this.owner.color // Convert to p5-color (like Bullet) if alpha is needed
		const move = getOffsetPoint(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}
		this.next = { // Is updated every frame (since a getter would recalc every wall * frame etc)
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
		this.penetratedWall = null
	}

	envCollision(i, wall = null) { // Wall is not passed when checking edge collisions //TODO: Make separate functions for edge / wall

		const collision = wall ? this._checkWallCollision(wall) && !this._penetration(wall) : this._checkEdgeCollision()

		if (collision) {
			this._destroy(i)
		}
	}

	_checkWallCollision(wall) { // 'wall' can be passed as null, if we are checking edges
		const wallRect = getWallRect(wall)

		// Looks at "all" positions between location and (fraction of) 'next' location:
		for (let step = 0; step <= this.speed; step += Config.current.wall.collisionCheckStepSize) {

			// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
			const next = {
				x: this.x + this.moveCoords.dX * (step / this.speed),
				y: this.y + this.moveCoords.dY * (step / this.speed)
			}

			if (pointInRect({ x: next.x, y: next.y }, wallRect)) {
				return true // NOTHING (not even false) may be returned if !pointInRect, since this stops looping of lookahead steps
			}
		}
	}

	_checkEdgeCollision() {
		// outOfBounds() always returns object (truthy) to also get an axis, even though just true/false is used here:
		const { x, y } = outOfBounds(this.next.x, this.next.y)

		if (x || y) {
			return true // NOTHING (not even false) may be returned if !x || !y, since this stops looping
		}
	}

	_penetration(wall) {
		// First collision with a wall: 
		if (!this.penetratedWall) {

			// Saves the wall:
			this.penetratedWall = wall

			// Reduces speed:
			this.speed /= Config.current.equipment.m82.penetrationSpeedDivisor

			// Recalculates moveCoords based on new speed:
			const { x, y } = getOffsetPoint(this.speed, this.direction)
			this.moveCoords = {
				dX: x,
				dY: y
			}

			// Returns true to not call .destroy() (pass through wall) in .collision():
			return true
		} else {
			// If there is a saved wall already, pass through if the wall is the same (if we have not gone all the way through wall yet), otherwise .destroy():
			return wall === this.penetratedWall
		}
	}

	_move() {
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	_show() {
		push()

		translate(this.x, this.y)
		rotate(this.direction)
		image(this.asset, 0, 0)

		pop()
	}

	_updateNext() {
		this.next = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	_destroy(i) {
		state.projectiles.splice(i, 1)
	}

	onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
		this._move()
		this._show()
		this._updateNext()
	}
}

//* BREAKER
class BreakerBullet extends Projectile {
	constructor(owner) {
		super(owner)

		this.type = 'breaker'
		this.asset = assets.projectiles[this.type]
		// A circle with diameter the width of the projectile image will be good enough:
		this.d = this.asset.height // To make p5-rotate work normally, all images must be on their side, hence: width of projectile is height of image
		this.direction = owner.direction
		this.speed = Config.current.equipment.breaker.speed
		this.x = this.owner.cannon.x
		this.y = this.owner.cannon.y
		//!this.color = this.owner.color // Convert to p5-color (like Bullet) if alpha is needed
		const move = getOffsetPoint(this.speed, this.direction)
		this.moveCoords = {
			dX: move.x,
			dY: move.y
		}
		this.next = { // Is updated every frame (since a getter would recalc every wall * frame etc)
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	envCollision(i, wall = null) { // Wall is not passed when checking edge collisions //TODO: Make separate functions for edge / wall
		if (wall && this._checkWallCollision(wall)) {
			this._breakWall(wall)

			//TODO: Blast zone behind wall

			this._destroy(i)
			return 'continue'

		} else if (this._checkEdgeCollision()) {
			this._destroy(i)
			return 'continue'
		}
	}

	_checkWallCollision(wall) { // 'wall' can be passed as null, if we are checking edges
		const wallRect = getWallRect(wall)

		// Looks at "all" positions between location and (fraction of) 'next' location:
		for (let step = 0; step <= this.speed; step += Config.current.wall.collisionCheckStepSize) {

			// This has to be in fractions of moveCoords (and not just +- some values) to account for the direction of the movement - we don't want to ADD to a negative and vice versa:
			const next = {
				x: this.x + this.moveCoords.dX * (step / this.speed),
				y: this.y + this.moveCoords.dY * (step / this.speed)
			}

			if (pointInRect({ x: next.x, y: next.y }, wallRect)) {
				return true // NOTHING (not even false) may be returned if !pointInRect, since this stops looping
			}
		}
	}

	_checkEdgeCollision() {
		// outOfBounds() always returns object (truthy) to also get an axis, even though just true/false is used here:
		const { x, y } = outOfBounds(this.next.x, this.next.y)

		if (x || y) {
			return true // NOTHING (not even false) may be returned if !x || !y, since this stops looping
		}
	}

	_breakWall(wall) {
		wall.destroy()
	}

	_move() {
		this.x += this.moveCoords.dX
		this.y += this.moveCoords.dY
	}

	_show() {
		push()

		translate(this.x, this.y)
		rotate(this.direction)
		image(this.asset, 0, 0)

		pop()
	}

	_updateNext() {
		this.next = {
			x: this.x + this.moveCoords.dX,
			y: this.y + this.moveCoords.dY
		}
	}

	_destroy(i) {
		state.projectiles.splice(i, 1)
	}

	onFrame(i) { // Duration based projectiles need to destroy(i), so every projectile gets passed their index
		this._move()
		this._show()
		this._updateNext()
	}
}