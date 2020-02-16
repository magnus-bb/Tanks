<template>
  <div class="config-menu">
    <header class="header">
      <button class="header__back-button" @click="closeConfig"><img src="@/assets/icons/back.svg" /></button>
			<h1 class="header__title">Game Configuration</h1>
    </header>

		<section class="configs">

		</section>
    <!-- Reactivity template: -->
    <p>Reactivity Test:</p>
    <input v-model="bulletSpeed" type="number" />
    {{ bulletSpeed }}

  </div>
</template>

<script>
export default {
	name: 'GameMenuConfig',
	computed: {
		//! Reactivity template:
		// Only needed here (both get and set) for shortening the inline v-model:
		// Inline does not need a computed value, and can reference $store.state... etc. directly
		// while maintaining reactivity
		bulletSpeed: {
			get() {
				return this.$store.state.config.projectile.bullet.speed
			},
			set(val) {
				this.$store.state.config.projectile.bullet.speed = Number(val)
			},
		},
	},

	methods: {
		closeConfig() {
			this.$emit('input', false) // Menu wrapper handles opening config
		},
	},
}
</script>

<style lang="scss" scoped>
@import '@/scss/global';

.config-menu {
	height: 100%;
	width: 100%;

	@include window;

	display: flex;
	flex-direction: column;

	padding: 3%;
}

.header {
	position: relative;
	display: flex;
	justify-content: center;
}

.header__back-button {
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);

	@include bg(var(--light-text));
	@include medium-outset;

	border-radius: 10em; // Completely rounded

	display: flex;
	justify-content: center;
	align-items: center;

	padding: 0.5em;

	&:active {
		@include medium-outset-active;
	}
}

.header__title {
	// position: absolute;
	// left: 50%;
	// transform: translateX(-50%);

	@include small-outset;
	@include bg(var(--light-text));
	@include h1;
	padding: 0.3em 0.5em;

	border-radius: 5px;
}

.configs {
	
}
</style>