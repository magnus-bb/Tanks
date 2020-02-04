<template>
  <div id="canvasContainer">
    <p>Canvas Works</p>
  </div>
</template>

<script>
//* Libs:
// import P5 from 'p5'

//* Mixins / Classes:
import preload from '@/game/preload.js'
import setup from '@/game/setup.js'
import draw from '@/game/draw.js'
//import Pickup from '@/game/Pickups.js'
//import Config from '@/game/Config.js'
//import GameState from '@/game/GameState.js'

export default {
	name: 'GameCanvas',
	mixins: [],
	props: [],
	data() {
		return {
			//p5: this.$store.state.p5,
			//config: this.$store.state.config,
			// state: new GameState,
		}
	},
	methods: {},
	mounted() {
		//this.$store.commit('setConfig', new Config)

		this.$store.commit('setupSketch', {
			preload: preload,
			setup: setup,
			draw: draw
		}) 

	},
}
</script>

<style lang="scss" scoped>
</style>