<template>
  <input :value="displayValue" @keydown="handleKey($event)" class="controls__input" type="text" :placeholder="placeholder" spellcheck="false" readonly/>
</template>

<script>
export default {
	name: 'KeybindingInput',
	props: ['placeholder'],

	data() {
		return {
			// value: '',
			displayValue: ''
		}
	},

	methods: {
		handleKey(event) {
			this.$emit('input', event.keyCode)
			// this.value = event.keyCode // What is read by the game

			const key = event.key
			if (key === ' ') { 
				this.displayValue = 'Space' // Shows spacebar with text
			} else if (key.match('Arrow')) {
				this.displayValue = key.replace('Arrow', '') // Removes prefixed 'arrow' on arrow key names
			} else if (key.length === 1) {
				this.displayValue = key.toUpperCase() // Single letters become uppercase
			} else {
				this.displayValue = key // Special keys remain unchanged
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/scss/global';

.controls__input {
	@include bg(var(--light-text));
	@include shallow-inset;
	@include standard-input;

	width: 85%;

	border-radius: 10em; // Completely rounded

	text-align: center;
	font-size: 1.2rem;

	cursor: pointer;

}
</style>