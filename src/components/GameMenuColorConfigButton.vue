<template>
  <button class="configs__color-button" :style="backgroundColor" @click="selectColor($event)"></button>
</template>

<script>
export default {
	name: 'ColorConfigButton',
	props: ['target', 'prop'], // Split in two, so target can be passed as ref: target[prop]

	computed: {
		backgroundColor() {
			// Hex colors / RGB colors
			return {
				'--selected-color':
					this.target[this.prop][0] === '#'
						? this.target[this.prop]
						: `rgb(${this.target[this.prop]})`,
			}
		},
	},

	methods: {
		selectColor(event) {
			this.$emit('selectColor', { target: this.target, prop: this.prop, event })
		},
	},
}
</script>

<style lang="scss" scoped>
@import '@/scss/global';

.configs__color-button {
	height: 100px;
	width: 100px;
	border-radius: 10em;

	@include bg(var(--selected-color));
	@include small-outset;
}
</style>