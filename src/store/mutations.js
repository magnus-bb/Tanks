import Vue from 'vue'

export const mutations = {
	set(state, { target, prop, val }) {
		Vue.set(state.gameStatus.players[target], prop, val)
	}, 

	addPlayer(state, player) {
		state.gameStatus.players.push(player)
	},

	setupSketch(state, payload) {
		state.p5.preload = payload.preload
		state.p5.setup = payload.setup
		state.p5.draw = payload.draw
	},

	setConfig(state, config) {
		state.config = config
	},

	pushSetupCell(state, cell) {
		state.setup.cellStack.push(cell)
	},

	popSetupCell(state) {
		state.setup.cellStack.pop()
	},

	addPickup(state, pickup) {
		state.gameState.pickups.push(pickup)
	},

	addProjectile(state, projectile) {
		state.gameState.projectiles.push(projectile)
	},

	removePickup(state, index) {
		state.gameState.pickups.splice(index, 1)
	},

	deleteBulletTrail(state, bullet) {
		state.gameState.fx.bulletTrails.delete(bullet)
	},

	setPauseStatus(state, bool) {
		state.gameStatus.paused = bool
	},

	setStartedStatus(state, bool) {
		state.gameStatus.started = bool
	},

	setCreatedStatus(state, bool) {
		state.gameStatus.created = bool
	},

	setPickupAsset(state, payload) {
		state.assets.pickups[payload.name] = payload.asset
	},

	setGameState(state, gameState) {
		state.gameState = gameState
	},

	resetGameStatus(state) {
		state.gameStatus = {
			paused: true,
			started: false,
			created: false,
			players: []
		}
	},

	addGridColumn(state, col) {
		state.gameState.grid.push(col)
	},

	addTank(state, tank) {
		state.gameState.tanks.push(tank)
	},

	gameEnding(state) {
		state.gameState.ending = true
	},

	endTimer(state) {
		state.gameState.endTimer--
	},

	addParticle(state, particle) {
		state.gameState.fx.particles.array.push(particle)
	},

	createBulletTrailArray(state, bullet) {
		state.gameState.fx.bulletTrails.set(bullet, [])
	},

	addBulletTrailPoint(state, payload) {
		const trail = state.gameState.fx.bulletTrails.get(payload.bullet)

		trail.push({ x: payload.x, y: payload.y }) //TODO: Mutation
	},

	removeProjectile(state, index) {
		state.gameState.projectiles.splice(index, 1)
	},

	removeTank(state, index) {
		state.gameState.tanks.splice(index, 1)
	}
}