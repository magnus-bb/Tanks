<template>
  <div class="config-menu">
    <header class="header">
      <button class="header__back-button" @click="closeConfig">
        <img src="@/assets/icons/back.svg" />
      </button>
      <h1 class="header__title">Game Configuration</h1>
    </header>

    <div class="config-menu__scroll-wrapper">
      <section class="configs">
        <div class="configs__game">
          <color-config-button :target="config" prop="bgColor" @selectColor="selectColor($event)" />
        </div>
        <div class="configs__pickups"></div>
        <div class="configs__bullet"></div>
        <div class="configs__m82"></div>
        <div class="configs__breaker"></div>
        <div class="configs__wormhole"></div>
        <div class="configs__laser-sight"></div>
        <div class="configs__stealth-ammo"></div>
        <div class="configs__tank"></div>
        <div class="configs__grid"></div>
        <div class="configs__fx"></div>
      </section>
    </div>

    <!-- Reactivity template: -->
    <p>Reactivity Test:</p>
    <input v-model="bulletSpeed" type="number" />
    {{ bulletSpeed }}

    <color-input
      id="configMenuColorPicker"
      :selectedColor="colorTarget.target[colorTarget.prop]"
      @color="setColor($event)"
      @hide="hideColorInput"
      :style="colorInputRendering"
      :pointerEvents="colorInputPointerEvents"
    />
  </div>
</template>

<script>
import ColorInput from './GameMenuColorInput.vue'
import ColorConfigButton from './GameMenuColorConfigButton.vue'

export default {
	name: 'GameMenuConfig',
	components: {
		ColorInput,
		ColorConfigButton,
	},

	data() {
		return {
			colorTarget: { target: this.$store.state.config, prop: 'bgColor' }, // Initial value doesn't matter, just has to be valid (to avoid error on mount)
			colorInputShow: 'none',
			colorInputPointerEvents: false,
			colorInputCoords: {
				x: 0,
				y: 0,
			},
		}
	},

	computed: {
		config() {
			return this.$store.state.config
		},

		colorInputRendering() {
			return {
				'--top': this.colorInputCoords.y + 'px',
				'--left': this.colorInputCoords.x + 'px',
				'--show': this.colorInputShow,
			}
		},
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
			this.$emit('input', false) // Menu wrapper handles opening config-menu
		},

		selectColor({ target, prop, event }) {
			this.colorTarget = {
				target,
				prop,
			}

			this.colorInputCoords = {
				x: event.layerX, // Uses layer, not page, since colorInput is absolutely positioned
				y: event.layerY,
			}

			this.colorInputShow = 'flex'
			this.colorInputPointerEvents = true
		},

		setColor(event) {
			this.colorTarget.target[this.colorTarget.prop] = event
		},

		hideColorInput() {
			this.colorInputShow = 'none'
			this.colorInputPointerEvents = false
		},
	},
}
</script>

<style lang="scss" scoped>
@import '@/scss/global';

.config-menu {
	display: relative;
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

	padding: 0.7em;

	&:active {
		@include medium-outset-active;
	}
}

.header__title {
	@include small-outset;
	@include bg(var(--light-text));
	@include h1;
	padding: 0.3em 0.5em;

	border-radius: 5px;
}

.config-menu__scroll-wrapper {
	overflow: hidden;

	margin-top: 3%;

	@include shallow-inset;
}

.configs {
	// Margin-padding to hide scrollbar, while still making it usable
	// Height to make sure it uses scroll
	margin-right: -25px;
	padding-right: 25px;
	max-height: 100%;

	overflow-y: auto;

	display: grid;
	flex-wrap: wrap;
	grid-row-gap: 10px;

	// & > div {
	// 	height: 50px;
	// 	width: 100px;
	// 	background: blue;
	// }
}
</style>