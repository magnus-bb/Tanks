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
	mounted() {

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