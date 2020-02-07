<template>
  <div class="status">
    <button @click="createPickup('m82')">M82</button>
    <button @click="createPickup('wormhole')">Wormhole</button>
    <button @click="createPickup('breaker')">Breaker</button>
    <button @click="createPickup('ammo')">Ammo</button>
    <button @click="createPickup('stealthAmmo')">Stealth Ammo</button>

  </div>
</template>

<script>
import Pickup from '@/game/Pickups.js'

export default {
	name: 'GameStatus',
	components: {},

	methods: {
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