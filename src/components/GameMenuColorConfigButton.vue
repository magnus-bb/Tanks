<template>
  <button class="configs__color-button" :style="backgroundColor"></button>
</template>

<script>
export default {
	name: 'ColorConfigButton',
	props: ['colorValues'],

	computed: {
		backgroundColor() {
				// Hex colors / RGB colors
				return { '--selected-color': this.colorValues[0] === '#' ? this.colorValues : `rgb(${this.colorValues})`}
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