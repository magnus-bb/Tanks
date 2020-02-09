<template>
  <div id="picker"></div>
</template>

<script>
import P5 from 'p5'

export default {
	name: 'ColorPicker',
	created() {
		const picker = new P5((sketch) => {
			let colors

			sketch.preload = function() {
				colors = sketch.loadImage('assets/colors.png')
			}

			sketch.setup = function() {
				const canvas = sketch.createCanvas(256, 256)
				sketch.image(colors, 0, 0)
				canvas.parent('picker')
			}
		})
	},
}
</script>

<style lang="scss" coped>
#picker {
	position: absolute;
	top: 0;
	left: 0;
}


</style>