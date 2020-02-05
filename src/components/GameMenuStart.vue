<template>
  <div id="startMenu" class="start-menu">
    <p>Start Works</p>
    <button @click="testStart">2P Start</button>
    <button @click="createPickup('m82')">M82</button>
    <button @click="createPickup('wormhole')">Wormhole</button>
    <button @click="createPickup('breaker')">Breaker</button>
    <button @click="createPickup('ammo')">Ammo</button>
    <button @click="createPickup('stealthAmmo')">Stealth Ammo</button>
		<input v-model="test" type="number" />
		<button @click="setFps">FPS</button>
		<button @click="setConfig">Config</button>
		<button @click="logFps">Log</button>
  </div>
</template>

<script>
import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'
import Pickup from '@/game/Pickups.js' //! TEST
import Config from '@/game/Config.js' //! TEST

export default {
	name: 'GameMenuStart',
	mixins: [],
	computed: {
		test: {
			get() {
				return this.$store.state.config.fps
			},
			set(val) {
				this.$store.state.config.fps = Number(val)
			}
		} 
	},
	data() {
		return {
			// test: this.$store.getters.config().fps
			
			//p5: this.$store.state.p5
		}
	},
	methods: {
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

		setFps() {
			const config = this.$store.getters.config

			config().fps = 10
			console.log(config().fps)
		},

		setConfig() {
			const config = this.$store.getters.config

			this.$store.commit('setConfig', new Config)

			console.log(config().fps)
		},

		logFps() {
			console.log(this.$store.getters.config().fps)
		},
	},
	mounted() {
		
	}
}
</script>

<style lang="scss" scoped>
</style>