<template>
  <div class="menu">
    <section class="add-player">
      <input
        class="add-player__name-input input--base"
        v-model="selectedName"
        type="text"
        placeholder="Player Name"
        min="2"
        max="10"
      />
      <div class="controls">
        <input class="controls__input input--base" type="text" placeholder="Fire" disabled />
        <input class="controls__input input--base" type="text" placeholder="Forward" disabled />
        <input class="controls__input input--base" type="text" placeholder="Backward" disabled />
        <input class="controls__input input--base" type="text" placeholder="Turn Left" disabled />
        <input class="controls__input input--base" type="text" placeholder="Turn Right" disabled />
      </div>

      <button class="add-player__color-input" @click="selectColor($event)">
        <!-- <img src="@/assets/color-tank.svg"> -->
        <inline-svg :src="require('@/assets/color-tank.svg')"></inline-svg>
      </button>
      <!-- <div class="select-color-container"></div> -->
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
      @hide="colorInputShow='none'"
      :style="colorInputRendering"
    />
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import ColorInput from './ColorInput.vue'

import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'

export default {
	name: 'GameMenuCreate',
	components: {
		InlineSvg,
		ColorInput,
	},
	mixins: [],
	computed: {},
	data() {
		return {
			selectedName: '',
			selectedColor: [73, 2, 2, 255],
			colorInputShow: 'none',
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
			// game.addPlayer(
			// 	new Player(1, 'One', [255, 0, 0], new Controls(69, 68, 83, 70, 86))
			// )
		},

		selectColor(event) {
			// Only clicks on relevant parts of svg:
			if (!event.target.classList.contains('select-color-input')) return

			this.colorInputCoords = {
				x: event.layerX, // Uses layer, not page, since colorInput is absolutely positioned
				y: event.layerY,
			}

			this.colorInputShow = 'flex'
		},

		setColor(event) {
			this.selectedColor = event

			const fill = `rgba(${event})`
			document.querySelector('#tankColor').style.fill = fill
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

	mounted() {},
}
</script>






// Buttons scale with the font-size:
<style lang="scss" scoped>
.menu {
	//! Global?
	height: 100%;
	display: flex;

	--cta-color: #1654f0;
	--light-text: #ebecf0;
	--dark-text: #6d7587;
	--darkest-text: #222629;
}

@mixin standard-input {
	color: #222629;
	font-family: Montserrat;
	border: none;

	&::placeholder {
		opacity: 0.6;
		color: var(--dark-text);
	}
}

@mixin standard-bg {
	background: linear-gradient(
			350deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 100%
		),
		var(--light-text);
	background-blend-mode: soft-light, normal;
}

@mixin shallow-inset {
	box-shadow: inset 3px 3px 5px #a6abbd, inset -3px -3px 5px #fafbff, 5px 5px 10px #cfd5eb, -5px -5px 10px #ffffff;
}

@mixin medium-inset {
	box-shadow: inset 7px 7px 15px #a6abbd, inset -7px -7px 15px #fafbff;
}

@mixin small-outset {
	box-shadow: 5px 5px 10px #aeb4c7, -5px -5px 10px #fafbff;
}

@mixin medium-outset {
	box-shadow: 10px 10px 20px #b7bccf, -10px -10px 20px #fff;
}

@mixin medium-outset-active {
		box-shadow: 10px 10px 20px #b7bccf, -10px -10px 20px #fff, inset 7px 7px 15px #a6abbd, inset -7px -7px 15px #fafbff;
}

@mixin medium-darker-outset {
	box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff;
}

@mixin medium-darker-outset-active {
	box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff, inset 7px 7px 15px #a6abbd, inset -7px -7px 15px #fafbff;
}

.add-player {
	@include standard-bg;
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
		@include standard-bg;
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

		.controls__input {
			@include standard-bg;
			@include shallow-inset;
			@include standard-input;

			width: 85%;

			border-radius: 10em; // Completely rounded

			text-align: center;
			font-size: 1.2rem;

			cursor: pointer;
		}
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
		@include standard-bg;
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
		@include standard-bg;
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
			box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff, inset 7px 7px 15px #0f39a1, inset -7px -7px 15px #4f81ff;
		}
	}
}
</style>