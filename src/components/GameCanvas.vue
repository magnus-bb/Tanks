<template>
  <div id="canvasContainer" class="canvas-container">



  </div>
</template>

<script>

//* Mixins / Classes:
import preload from '@/game/preload.js'
import setup from '@/game/setup.js'
import draw from '@/game/draw.js'

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