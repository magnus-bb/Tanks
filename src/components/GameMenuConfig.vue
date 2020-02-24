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
        <div class="configs__group">
          <h2 class="configs__h2">General</h2>

          <!-- requires restart? -->
          <div class="configs__group-item">
            <h3 class="configs__h3">Frames Per Second:</h3>
            <input v-model="config.fps" type="number" min="1" max="60" />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Background Colour:</h3>
            <color-config-button
              class="configs__color-button"
              :target="config"
              prop="bgColor"
              @selectColor="selectColor($event)"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Wall Colour:</h3>
            <color-config-button
              class="configs__color-button"
              :target="config"
              prop="strokeColor"
              @selectColor="selectColor($event)"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Stay-alive Time:</h3>
            <input v-model="config.game.endFrames" type="number" min="1" max="1000" />
          </div>
        </div>

        <div class="configs__group">
					<h2 class="configs__h2">Pickups</h2>

					<div class="configs__group-item">
            <h3 class="configs__h3">Spawn Interval:</h3>
            <input v-model="config.pickup.spawnInterval" type="number" min="50" max="1000" />
          </div>

					<div class="configs__group-item">
            <h3 class="configs__h3">Spawn Chance:</h3>
            <input v-model="config.pickup.spawnChance" type="range" min="0.05" max="1.0" step="0.05" />
						<p>{{ config.pickup.spawnChance }}</p>
          </div>
				</div>

				<div class="configs__group">
					<h2 class="configs__h2">Bullets</h2>

					<div class="configs__group-item">
            <h3 class="configs__h3">Speed:</h3>
            <input v-model="config.projectile.bullet.speed" type="range" min="3" max="10" />
						<p>{{ config.projectile.bullet.speed }}</p>
          </div>

					<div class="configs__group-item">
            <h3 class="configs__h3">Duration:</h3>
            <input v-model="config.projectile.bullet.duration" type="number" min="30" max="1200" />
          </div>
				</div>

				<div class="configs__group">
					<h2 class="configs__h2">M82</h2>

					<div class="configs__group-item">
            <h3 class="configs__h3">Speed:</h3>
            <input v-model="config.projectile.m82.speed" type="range" min="5" max="40" />
						<p>{{ config.projectile.m82.speed }}</p>
          </div>

					<!-- Does not change collisions, since diameter is not used -->
					<div class="configs__group-item">
            <h3 class="configs__h3">Penetration Speed Divisor:</h3>
            <input v-model="config.projectile.m82.penetrationSpeedDivisor" type="range" min="1" max="8" step="0.5" />
						<p>{{ config.projectile.m82.penetrationSpeedDivisor }}</p>
          </div>

					<div class="configs__group-item">
            <h3 class="configs__h3">Ammo:</h3>
            <input v-model="config.equipment.m82.ammo" type="range" min="1" max="10" />
						<p>{{ config.equipment.m82.ammo }}</p>
          </div>
				</div>

				<div class="configs__group">
					<h2 class="configs__h2">Breaker</h2>

					<div class="configs__group-item">
            <h3 class="configs__h3">Speed:</h3>
            <input v-model="config.projectile.breaker.speed" type="range" min="3" max="15" />
						<p>{{ config.projectile.breaker.speed }}</p>
          </div>
				</div>

				<div class="configs__group">
					<h2 class="configs__h2">Wormhole</h2>

					<div class="configs__group-item">
            <h3 class="configs__h3">Charge Time:</h3>
            <input v-model="config.equipment.wormhole.chargeFrames" type="number" min="1" max="300" />
          </div>
				</div>

        
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
		decimals(num, numOfDecimals) {
			return num.toFixed(numOfDecimals)
		},

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
	grid-template-columns: 1fr 1fr;
	justify-content: center; //? Check om dette skal være -items
	grid-auto-flow: row dense;

	// & > div {
	// 	height: 50px;
	// 	width: 100px;
	// 	background: blue;
	// }
}

.configs__group {
	margin: 1.5em;
	display: flex;
	flex-direction: column;
	align-items: center;
	// justify-content: center;
}

.configs__group-item {
	margin-bottom: 1em;

	width: 90%;

	display: flex;
	// flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.configs__h2 {
	margin-bottom: 1em;
	color: var(--darkest-text);
	font-size: 1.5rem;
}

.configs__h3 {
	// margin-right: 1em;

	font-family: Raleway;
	font-size: 1rem;
	color: var(--dark-text);
	font-style: italic;
}

.configs__color-button {
	height: 3rem;
	width: 3rem;
}
</style>