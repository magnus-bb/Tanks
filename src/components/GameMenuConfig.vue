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

          <!-- requires restart?
					<div class="configs__group-item">
            <h3 class="configs__h3">Cell Width:</h3>
            <input v-model="config.cell.width" type="number" min="35" max="100" />
          </div> 

					<div class="configs__group-item">
            <h3 class="configs__h3">Cell Amount X:</h3>
            <input v-model="config.cell.xAmt" type="number" min="5" max="25" />
          </div>

					<div class="configs__group-item">
            <h3 class="configs__h3">Cell Amount Y:</h3>
            <input v-model="config.cell.yAmt" type="number" min="5" max="25" />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Frames Per Second:</h3>
            <input v-model="config.fps" type="number" min="1" max="60" />
          </div>
          -->

          <div class="configs__group-item">
            <h3 class="configs__h3">Wall Occurrence Rate:</h3>
            <p class="configs__range-value">{{ Number(config.wall.occurrenceRate).toFixed(2) }}</p>
            <input
              class="configs__range-input"
              v-model="config.wall.occurrenceRate"
              type="range"
              min="0"
              max="1"
              step="0.05"
            />
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
            <h3 class="configs__h3">Line Colour:</h3>
            <color-config-button
              class="configs__color-button"
              :target="config"
              prop="strokeColor"
              @selectColor="selectColor($event)"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Stay-alive Time:</h3>
            <input
              class="configs__number-input"
              v-model="config.game.endFrames"
              type="number"
              min="1"
              max="1000"
              @blur="validateNumber($event.target)"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Pickups</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Spawn Interval:</h3>
            <input
              class="configs__number-input"
              v-model="config.pickup.spawnInterval"
              type="number"
              min="50"
              max="1000"
              @blur="validateNumber($event.target)"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Spawn Chance:</h3>
            <p class="configs__range-value">{{ Number(config.pickup.spawnChance).toFixed(2) }}</p>
            <input
              class="configs__range-input"
              v-model="config.pickup.spawnChance"
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Bullets</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Speed:</h3>
            <p class="configs__range-value">{{ config.projectile.bullet.speed }}</p>
            <input
              class="configs__range-input"
              v-model="config.projectile.bullet.speed"
              type="range"
              min="3"
              max="10"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Duration:</h3>
            <input
              class="configs__number-input"
              v-model="config.projectile.bullet.duration"
              type="number"
              min="30"
              max="1200"
              @blur="validateNumber($event.target)"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Ammo:</h3>
            <p class="configs__range-value">{{ config.tank.ammo }}</p>
            <input
              class="configs__range-input"
              v-model="config.tank.ammo"
              type="range"
              min="0"
              max="10"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Bullet Trail:</h3>
            <!-- <input v-model="config.fx.bulletTrail.on" type="checkbox" /> -->
            <div class="configs__checkbox">
              <input type="checkbox" id="bulletTrail" v-model="config.fx.bulletTrail.on" />
              <label for="bulletTrail">
                <div class="configs__checkbox-box"></div>
              </label>
            </div>
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Bullet Trail Length:</h3>
            <p class="configs__range-value">{{ config.fx.bulletTrail.length }}</p>
            <input
              class="configs__range-input"
              v-model="config.fx.bulletTrail.length"
              type="range"
              min="5"
              max="100"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">M82</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Speed:</h3>
            <p class="configs__range-value">{{ config.projectile.m82.speed }}</p>
            <input
              class="configs__range-input"
              v-model="config.projectile.m82.speed"
              type="range"
              min="5"
              max="40"
            />
          </div>

          <!-- Does not change collisions, since diameter is not used -->
          <div class="configs__group-item">
            <h3 class="configs__h3">Penetration Speed Divisor:</h3>
            <p class="configs__range-value">{{ Number(config.projectile.m82.penetrationSpeedDivisor).toFixed(1) }}</p>
            <input
              class="configs__range-input"
              v-model="config.projectile.m82.penetrationSpeedDivisor"
              type="range"
              min="1"
              max="8"
              step="0.5"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Ammo:</h3>
            <p class="configs__range-value">{{ config.equipment.m82.ammo }}</p>
            <input
              class="configs__range-input"
              v-model="config.equipment.m82.ammo"
              type="range"
              min="1"
              max="10"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Breaker</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Speed:</h3>
            <p class="configs__range-value">{{ config.projectile.breaker.speed }}</p>
            <input
              class="configs__range-input"
              v-model="config.projectile.breaker.speed"
              type="range"
              min="3"
              max="15"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Wormhole</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Charge Time:</h3>
            <input
              class="configs__number-input"
              v-model="config.equipment.wormhole.chargeFrames"
              type="number"
              min="1"
              max="300"
              @blur="validateNumber($event.target)"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Laser Sight</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Equipped on:</h3>
            <div v-for="equip of config.modifier.laserSight.possibleOn" :key="equip">
              <div class="configs__checkbox">
                <input
                  type="checkbox"
                  :id="equip"
                  :value="equip"
                  v-model="config.modifier.laserSight.onEquipment"
                />
                <label :for="equip">
                  <div class="configs__checkbox-box"></div>
                  {{ equip.capitalize() }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Stealth Ammo</h2>

          <div class="configs__group-item">
            <h3 class="configs__h3">Duration:</h3>
            <input
              class="configs__number-input"
              v-model="config.modifier.stealthAmmo.duration"
              type="number"
              min="30"
              max="1200"
              @blur="validateNumber($event.target)"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Opacity:</h3>
            <p class="configs__range-value">{{ config.modifier.stealthAmmo.alpha }}</p>
            <input
              class="configs__range-input"
              v-model="config.modifier.stealthAmmo.alpha"
              type="range"
              min="0"
              max="255"
            />
          </div>
        </div>

        <div class="configs__group">
          <h2 class="configs__h2">Tank</h2>

          <!-- Warn that cannon-length cannot be shorter than radius! (pop-up when this is set?) -->

          <div class="configs__group-item">
            <h3 class="configs__h3">Diameter:</h3>
            <p class="configs__range-value">{{ config.tank.diameter }}</p>
            <input
              class="configs__range-input"
              v-model="config.tank.diameter"
              type="range"
              min="5"
              max="45"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Cannon length:</h3>
            <p class="configs__range-value">{{ config.tank.cannon.length }}</p>
            <input
              class="configs__range-input"
              v-model="config.tank.cannon.length"
              type="range"
              min="5"
              max="40"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Move Speed:</h3>
            <p class="configs__range-value">{{ Number(config.tank.moveSpeed).toFixed(1) }}</p>
            <input
              class="configs__range-input"
              v-model="config.tank.moveSpeed"
              type="range"
              min="0.5"
              max="4"
              step="0.5"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Turn Speed:</h3>
            <p class="configs__range-value">{{ Number(config.tank.turnSpeed).toFixed(1) }}</p>
            <input
              class="configs__range-input"
              v-model="config.tank.turnSpeed"
              type="range"
              min="1"
              max="15"
              step="0.5"
            />
          </div>

          <div class="configs__group-item">
            <h3 class="configs__h3">Collision Slow:</h3>
            <p class="configs__range-value">{{ Number(config.tank.collisionMoveSlow).toFixed(1) }}</p>
            <input
              class="configs__range-input"
              v-model="config.tank.collisionMoveSlow"
              type="range"
              min="1"
              max="10"
              step="0.5"
            />
          </div>
        </div>
      </section>
    </div>

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
import helpers from '@/game/helpers.js'

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
	},

	methods: {
		validateNumber(e) {
			if (e.valueAsNumber < Number(e.min)) {
				e.value = e.min
			} else if (e.valueAsNumber > Number(e.max)) {
				e.value = e.max
			}

			console.log(e.min, e.value, e.max)
		},

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
}

.configs__group {
	margin: 1.5em;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.configs__group-item {
	margin-bottom: 1.2em;

	width: 90%;

	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	align-items: center;
}

.configs__h2 {
	margin-bottom: 1em;
	color: var(--darkest-text);
	font-size: 1.5rem;
}

.configs__h3 {
	font-family: Raleway;
	font-size: 1rem;
	color: var(--dark-text);
	font-style: italic;
}

.configs__color-button {
	height: 3rem;
	width: 3rem;
}

.configs__range-input {
	//* Resets:
	appearance: none; /* Hides the slider so that custom slider can be made */
	width: 100%; /* Specific width is required for Firefox. */
	background: transparent; /* Otherwise white in Chrome */
	overflow: hidden;

	&::-webkit-slider-thumb {
		appearance: none;
	}

	&::-moz-range-thumb {
		background: transparent;
		border: none;
	}

	&:focus {
		outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
	}

	&::-ms-track {
		width: 100%;
		cursor: pointer;

		/* Hides the slider so custom styles can be added */
		background: transparent;
		border-color: transparent;
		color: transparent;
	}

	//* Styling:
	margin-top: 0.7em;
	border-radius: 10px;
	overflow: visible;

	&::-webkit-slider-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dee1eb;
		background: linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
		box-shadow: 1px 2px 2px rgba(89, 98, 120, 0.24);
	}
	&::-webkit-slider-runnable-track {
		@include shallow-inset;

		border-radius: 10px;
		height: 10px;
		overflow: visible;
		display: flex;
		align-items: center;
	}

	&::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dee1eb;
		background: linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
		box-shadow: 1px 2px 2px rgba(89, 98, 120, 0.24);
	}
	&::-moz-range-track {
		@include shallow-inset;

		border-radius: 10px;
		height: 10px;
		overflow: visible;
		display: flex;
		align-items: center;
	}
	&::-moz-range-progress {
		height: 10px;
		border-radius: 5px 0 0 5px;
		@include bg(var(--cta-color));
	}

	&::-ms-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dee1eb;
		background: linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
		box-shadow: 1px 2px 2px rgba(89, 98, 120, 0.24);
	}
	&::-ms-track {
		@include shallow-inset;

		border-radius: 10px;
		height: 10px;
		overflow: visible;
		display: flex;
		align-items: center;
	}
	&::-ms-fill-lower {
		height: 10px;
		border-radius: 5px 0 0 5px;
		@include bg(var(--cta-color));
	}
}

.configs__range-value {
	box-sizing: content-box;
	@include small-outset;
	@include bg(var(--light-text));
	text-align: center;
	color: var(--darkest-text);
	font-family: Montserrat;

	border-radius: 10px;
	font-size: 1rem;
	padding: 0.2ch 0.5ch;
	width: 4ch;
}

.configs__number-input {
	// Resets:
	box-sizing: content-box;
	appearance: textfield;
	outline: none;
	background: none;
	border: none;
	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	@include standard-input;

	@include shallow-inset;
	@include bg(var(--light-text));
	text-align: center;

	border-radius: 15px;
	font-size: 1rem;
	padding: 0.2ch 0.5ch;
	width: 4ch;
}

.configs__checkbox {
	.configs__checkbox-box {
		cursor: pointer;
		display: inline-block;
		height: 15px;
		width: 15px;
		border-radius: 3px;
		@include small-outset;
		@include bg(var(--focus-color));
	}

	input {
		appearance: none;

		&:checked + label .configs__checkbox-box {
			@include bg(var(--cta-color));
		}
	}
}
</style>