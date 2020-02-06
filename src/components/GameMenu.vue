<template>
  <div id="gameMenu" class="game-menu">
    <p>Menu Works</p>
    <game-menu-start />
    <game-menu-config />
    <game-menu-round />

    <!-- Game logic testing: -->
    <button @click="testStart">2P Start</button>
    <button @click="createPickup('m82')">M82</button>
    <button @click="createPickup('wormhole')">Wormhole</button>
    <button @click="createPickup('breaker')">Breaker</button>
    <button @click="createPickup('ammo')">Ammo</button>
    <button @click="createPickup('stealthAmmo')">Stealth Ammo</button>
    
  </div>
</template>

<script>
import GameMenuStart from './GameMenuStart.vue'
import GameMenuConfig from './GameMenuConfig.vue'
import GameMenuRound from './GameMenuRound.vue'

//! TEST
import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'
import Pickup from '@/game/Pickups.js' 

export default {
	name: 'GameMenu',
	components: {
		GameMenuStart,
		GameMenuConfig,
		GameMenuRound,
	},
	computed: {
	},

	methods: {






		//! For game logic testing:
		testStart() {
			game.addPlayer(
				new Player(1, 'One', [255, 0, 0], new Controls(69, 68, 83, 70, 86))
			)
			
			game.addPlayer(new Player(2, 'Other', [0, 255, 0], new Controls))
			game.new()
		},

		createPickup(name) {
			Pickup.create(name)
		},
	},
}
</script>

<style lang="scss" scoped>

button {
	//color: black;
}
</style>