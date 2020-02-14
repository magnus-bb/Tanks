<template>
  <input :value="displayValue" @keydown="handleKey($event)" class="controls__input" type="text" :placeholder="placeholder" spellcheck="false" readonly/>
</template>

<script>
export default {
	name: 'KeybindingInput',
	props: ['placeholder'],

	data() {
		return {
			value: '',
			displayValue: ''
		}
	},

	methods: {
		handleKey(event) {
			this.value = event.keyCode
			//! FIX SPACE
			this.displayValue = event.key.length > 1 ? event.key : event.key.toUpperCase()
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