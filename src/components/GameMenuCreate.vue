<template>
  <div class="menu">
    <section class="add-player">
      <input
        class="add-player__name-input"
        v-model="selectedName"
        type="text"
        placeholder="Player Name"
        minlength="1"
        maxlength="10"
				spellcheck="false"
      />
      <div class="controls">
				<keybinding-input v-model="selectedControls.fire" :placeholder="'Fire'"></keybinding-input>
				<keybinding-input v-model="selectedControls.forward" :placeholder="'Forward'"></keybinding-input>
				<keybinding-input v-model="selectedControls.backward" :placeholder="'Backward'"></keybinding-input>
				<keybinding-input v-model="selectedControls.left" :placeholder="'Turn Left'"></keybinding-input>
				<keybinding-input v-model="selectedControls.right" :placeholder="'Turn Right'"></keybinding-input>
      </div>

      <button class="add-player__color-input" @click="selectColor($event)">
        <inline-svg :src="require('@/assets/color-tank.svg')" :transformSource="setInitialColor"></inline-svg> <!-- require-syntax is required to use inline-svg -->
      </button>

      <button class="add-player__add-button" @click="addPlayer">
        <img src="@/assets/icons/add-player.svg" /> Add Player
      </button>
    </section>

    <section class="start">
      <button class="start__settings-button" @click="openConfig">
        <img src="@/assets/icons/settings.svg" /> Settings
      </button>
      <div class="titles">
        <h1 class="titles__title">Tanks</h1>
        <h2 class="titles__subtitle">Try Not To Kill Yourself</h2>
      </div>
      <button class="start__start-button" @click="testStart">Start Game</button>
    </section>

    <color-input
      :selectedColor="selectedColor"
      @color="setColor($event)"
      @hide="hideColorInput"
      :style="colorInputRendering"
      :pointerEvents="colorInputPointerEvents"
    />
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import ColorInput from './GameMenuCreateColorInput.vue'
import KeybindingInput from './GameMenuCreateKeybindingInput.vue'

import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'

export default {
	name: 'GameMenuCreate',
	components: {
		InlineSvg,
		ColorInput,
		KeybindingInput
	},
	mixins: [],
	computed: {
	},

	data() {
		return {
			selectedName: '',
			selectedColor: this.randomizeColor(), // Jumble?
			selectedControls: {
				fire: '',
				forward: '',
				backward: '',
				left: '',
				right: ''
			},

			colorInputShow: 'none',
			colorInputPointerEvents: false,
			colorInputCoords: {
				x: 0,
				y: 0,
			},
		}
	},

	computed: {
		colorInputRendering() {
			return {
				'--top': this.colorInputCoords.y + 'px',
				'--left': this.colorInputCoords.x + 'px',
				'--show': this.colorInputShow,
			}
		},
	},

	methods: {
		
		addPlayer() {
			const name = this.selectedName
			const color = this.selectedColor
			const fire = this.selectedControls.fire
			const forward = this.selectedControls.forward
			const backward = this.selectedControls.backward
			const left = this.selectedControls.left
			const right = this.selectedControls.right

			// Everything must be filled out:
			if (!(name && color && fire && forward && backward && left && right)) return console.log('Fill out everything')
			//TODO: Add message to fill out everything

			game.addPlayer(
				new Player(name, color, new Controls(forward, backward, left, right, fire))
			)
		},

		selectColor(event) {
			// Only clicks on relevant parts of svg:
			if (!event.target.classList.contains('select-color-input')) return

			this.colorInputCoords = {
				x: event.layerX, // Uses layer, not page, since colorInput is absolutely positioned
				y: event.layerY,
			}

			this.colorInputShow = 'flex'
			this.colorInputPointerEvents = true
		},

		randomizeColor() {
			return [Math.random() * 256, Math.random() * 256, Math.random() * 256]
		},

		// Used by inline-svg:
		setInitialColor(svg) {
			svg.children[0].firstElementChild.setAttribute('fill', `rgb(${this.selectedColor})`)
			return svg
		},

		setColor(event) {
			this.selectedColor = event

			const fill = `rgb(${event})`
			document.getElementById('tankColor').style.fill = fill
		},

		hideColorInput() {
			this.colorInputShow = 'none'
			this.colorInputPointerEvents = false
		},

		openConfig() {
			this.$emit('input', true) // Menu wrapper handles opening config
		},

		//! For game logic testing:
		testStart() {
			game.addPlayer(
				new Player('One', [255, 0, 0], new Controls(69, 68, 83, 70, 86))
			)

			game.addPlayer(new Player('Other', [0, 255, 0], new Controls()))
			game.new()
		},
	},
}
</script>






// Buttons scale with the font-size:
<style lang="scss" scoped>
@import '@/scss/global';

.menu {
	//! Global?
	height: 100%;
	display: flex;
}

.add-player {
	@include bg(var(--light-text));
	@include small-outset;

	margin: 3% 0 3% 3%;
	width: 50%;

	border-radius: 40px;

	display: grid;
	grid-template-rows: repeat(7, 1fr);
	grid-template-columns: 1fr 1fr;
	grid-template-areas:
		'name-input name-input'
		'controls select-color'
		'controls	select-color'
		'controls	select-color'
		'controls	select-color'
		'add-button	add-button'
		'add-button	add-button';
	align-items: center;
	justify-items: center;

	.add-player__name-input {
		@include bg(var(--light-text));
		@include shallow-inset;
		@include standard-input;

		grid-area: name-input;

		border-radius: 10em; // Completely rounded

		font-size: 1.5rem;

		text-align: center;
	}
	.controls {
		grid-area: controls;
		height: 80%;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
	}

	.add-player__color-input {
		grid-area: select-color;
		width: 75%;
		// Resets:
		background: none;
		cursor: pointer;

		//! Shadows
		filter: drop-shadow(5px 5px 10px #8b91a0)
			//! Filter fucker med x, y mousecoords
			drop-shadow(-5px -5px 10px #ffffff);
	}

	.add-player__add-button {
		@include bg(var(--light-text));
		@include medium-outset;

		grid-area: add-button;

		border-radius: 10em; // Completely rounded

		font-family: Montserrat;
		font-size: 1.4rem;
		color: var(--dark-text);

		display: flex;
		align-items: center;
		padding: 0.5em 1.5em;

		&:active {
			@include medium-outset-active;
		}

		img {
			margin-right: 0.5em;
			height: 1.5em;
		}
	}
}

.start {
	margin: 3% 3% 3% 0;
	width: 50%;

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	.start__settings-button {
		@include bg(var(--light-text));
		@include medium-outset;

		align-self: flex-end;

		border-radius: 10em; // Completely rounded

		font-family: Montserrat;
		font-size: 1rem;
		color: var(--dark-text);

		display: flex;
		align-items: center;
		padding: 0.5em 1em;

		&:active {
			@include medium-outset-active;
		}

		img {
			width: 1.5em;
			margin-right: 0.5em;
		}
	}

	.titles {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.titles__title {
			font-family: Montserrat;
			font-size: 4rem;
			color: var(--darkest-text);
			font-weight: normal;
		}

		.titles__subtitle {
			font-family: Raleway;
			font-size: 1.75rem;
			font-weight: 300;
			color: var(--dark-text);
			font-style: italic;
		}
	}

	.start__start-button {
		// @include bg(var(--cta-color));
		@include medium-darker-outset;
		margin-bottom: 5%;

		background: linear-gradient(
				350deg,
				rgba(0, 0, 0, 0.4) 0%,
				rgba(255, 255, 255, 0.4) 100%
			),
			var(--cta-color);
		color: var(--light-text);

		border-radius: 10em; // Completely rounded

		padding: 0.5em 1.5em;

		font-family: Montserrat;
		font-size: 2rem;
		font-weight: 500;

		display: flex;
		align-items: center;
		justify-content: center;

		&:active {
			box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff,
				inset 7px 7px 15px #0f39a1, inset -7px -7px 15px #4f81ff;
		}
	}
}
</style>