<template>
  <div class="status">
    <button @click="testStart">Test Start</button>
    <button @click="createPickup('m82')">M82</button>
    <button @click="createPickup('wormhole')">Wormhole</button>
    <button @click="createPickup('breaker')">Breaker</button>
    <button @click="createPickup('ammo')">Ammo</button>
    <button @click="createPickup('stealthAmmo')">Stealth Ammo</button>
  </div>
</template>

<script>
import Pickup from '@/game/Pickups.js'
import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'

export default {
	name: 'GameStatus',
	components: {},

	methods: {
		//! For game logic testing:
		testStart() {
			game.addPlayer(
				new Player('One', [255, 0, 0], new Controls(69, 68, 83, 70, 86))
			)

			game.addPlayer(new Player('Other', [0, 255, 0], new Controls()))
			game.new()
		},

		createPickup(name) {
			Pickup.create(name)
		},
	},
}
</script>

<style lang="scss" scoped>
.status {
	background: black;
}
</style>