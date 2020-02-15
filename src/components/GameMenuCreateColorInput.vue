<template>
  <div id="colorPicker" class="color-picker">
    <div class="color-vals-container">
      <span class="red">{{selectedColor[0]}}</span>
      <span class="green">{{selectedColor[1]}}</span>
      <span class="blue">{{selectedColor[2]}}</span>
    </div>
  </div>
</template>

<script>
import P5 from 'p5'
import col from '@/assets/all-colors.png'

export default {
	name: 'ColorInput',

	props: ['selectedColor', 'pointerEvents'],

	data() {
		return {
			// pickerType: 0

		}
	},

	created() {
		const picker = new P5(sketch => {
			let colors

			sketch.preload = () => {
				colors = sketch.loadImage(col)
			}

			sketch.setup = () => {
				const canvas = sketch.createCanvas(256, 256)
				sketch.image(colors, 0, 0)
			}

			sketch.draw = () => {
				if (
					sketch.mouseIsPressed &&
					sketch.mouseX.between(0, sketch.width) &&
					sketch.mouseY.between(0, sketch.height) &&
					this.pointerEvents // So colors cannot be selected when display: none
				) {
					const color = sketch.get(sketch.mouseX, sketch.mouseY).slice(0, 3) // Last alpha value is not needed
					this.$emit('color', color)
				}
			}

			sketch.mouseReleased = () => {
				this.$emit('hide')
			}
		}, 'colorPicker')
	},
}
</script>

<style lang="scss" scoped>
.color-picker {
	position: absolute;
	display: var(--show);
	flex-direction: column;
	top: var(--top);
	left: var(--left);
	cursor: crosshair;

	padding: 0.5rem;

	border: 1px solid rgba(255, 255, 255, 0.4);
	border-radius: 5px;
	background: linear-gradient(
			350deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 100%
		),
		#ebecf0;
	background-blend-mode: soft-light, normal;
	box-shadow: 5px 5px 10px #a6abbd;
}

.color-vals-container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	justify-items: center;
	order: 2;
	margin-top: 5px;
	cursor: default;

	span {
		color: #ebecf0;
		user-select: none;
		text-align: center;
		width: 2em;
		border-radius: 5px; //! Reactive
		box-shadow: 5px 5px 10px #a6abbd, -5px -5px 10px #fafbff;
		
	}

	.red {
		background: linear-gradient(
			350deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 100%
		), rgb(115,15,15);
	}

	.green {
		background: linear-gradient(
			350deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 100%
		), rgb(15,115,15);
	}

	.blue {
		background: linear-gradient(
			350deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 100%
		), rgb(15,15,115);
	}
}
</style>