<template>
  <div class="create-menu">
    <section class="add-player-section">
      <input class="player-name-input" type="text" placeholder="Player Name" />
      <div class="controls-container">
        <input type="text" placeholder="Fire" disabled />
        <input type="text" placeholder="Forward" disabled />
        <input type="text" placeholder="Backward" disabled />
        <input type="text" placeholder="Turn Left" disabled />
        <input type="text" placeholder="Turn Right" disabled />
      </div>

      <button @click="selectColor($event)" class="select-color-button">
        <!-- <img src="@/assets/color-tank.svg"> -->
        <inline-svg :src="require('@/assets/color-tank.svg')"></inline-svg>
      </button>
      <!-- <div class="select-color-container"></div> -->
      <button class="add-player-button">
        <img src="@/assets/icons/add-player.svg" /> Add Player
      </button>
    </section>

    <section class="start-section">
      <button class="settings-button" @click="openConfig">
        <img src="@/assets/icons/settings.svg" />Settings
      </button>
      <div class="title-container">
        <h1 class="title">Tanks</h1>
        <h2 class="subtitle">Try Not To Kill Yourself</h2>
      </div>
      <button class="start-button" @click="testStart">Start Game</button>
    </section>

		<color-input :selectedColor="selectedColor" @color="setColor($event)" @hide="colorInputShow='none'" :style="colorInputRendering"/>
		 <!-- @color="setColor($event)" -->
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
		ColorInput
	},
	mixins: [],
	computed: {},
	data() {
		return {
			selectedColor: [73, 2, 2, 255],
			colorInputShow: 'none',
			colorInputCoords: {
				x: 0,
				y: 0
			}
		}
	},
	computed: {
		colorInputRendering() {
			return {
				'--top': this.colorInputCoords.y + 'px',
				'--left': this.colorInputCoords.x + 'px',
				'--show': this.colorInputShow
			}
		}
	},
	methods: {
		selectColor(event) {
			// Only clicks on relevant parts of svg:
			if (!event.target.classList.contains('select-color-input')) return

			this.colorInputCoords = {
				x: event.layerX, // Uses layer, not page, since colorInput is absolutely positioned
				y: event.layerY
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
				new Player(1, 'One', [255, 0, 0], new Controls(69, 68, 83, 70, 86))
			)

			game.addPlayer(new Player(2, 'Other', [0, 255, 0], new Controls()))
			game.new()
		},
	},

	mounted() {},
}
</script>







<style lang="scss" scoped>
.create-menu {
	height: 100%;
	display: flex;
}

.add-player-section {
	width: 50%;
	margin: 3% 0 3% 3%; 

	border: 1px solid rgba(255, 255, 255, 0.4);
	border-radius: 40px; //! Reactive
	background: linear-gradient(
			311.44deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 105.18%
		),
		#ebecf0;
	background-blend-mode: soft-light, normal;
	box-shadow: 5px 5px 10px #a6abbd, -5px -5px 10px #fafbff;
}

input {
	color: #222629;
	font-family: Montserrat;

	&::placeholder {
		opacity: 0.6;
		color: #6d7587;
	}
}

.player-name-input {
	font-size: 1.125rem;
	text-align: center;
	background: linear-gradient(
			353.9deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 105.18%
		),
		#ebecf0;
	background-blend-mode: soft-light, normal;
	border: 1px solid rgba(255, 255, 255, 0.4);

	/* Shallow Inset Neumorphic */
	box-shadow: inset 2px 2px 4px #a6abbd, inset -2px -2px 4px #fafbff;
	border-radius: 47px; //! Reactive
}

.controls-container {
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;

	input {
		height: 22px; //! Reactive
		width: 102px; //! Reactive
		text-align: center;
		cursor: pointer;

		font-size: 0.875rem;

		background: linear-gradient(
				348.9deg,
				rgba(0, 0, 0, 0.4) 0%,
				rgba(255, 255, 255, 0.4) 105.18%
			),
			#ebecf0;
		background-blend-mode: soft-light, normal;
		border: 1px solid rgba(255, 255, 255, 0.4);

		/* Shallow Inset Neumorphic */
		box-shadow: inset 2px 2px 4px #a6abbd, inset -2px -2px 4px #fafbff;
		border-radius: 47px; //! Reactive
	}
}

.select-color-button {
	width: 152px; //! Reactivity
	height: 177px; //! Reactivity
	// Resets:
	background: none;
	cursor: pointer;
}

.add-player-button {
	display: flex;
	align-items: center;
	justify-content: space-evenly; //! margin left på tekst?

	width: 190px; //! Reactive
	height: 50px; //! Reactive

	background: linear-gradient(
			346.61deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 105.18%
		),
		#ebecf0;
	background-blend-mode: soft-light, normal;

	/* Medium Outset Neumorphic */
	box-shadow: 10px 10px 20px #a6abbd, -10px -10px 20px #fafbff;
	border-radius: 47px; //! Reactive

	font-family: Montserrat;
	font-size: 1.125rem;
	color: #6d7587;
}

.start-section {
	width: 50%;
	margin: 3% 3% 3% 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.settings-button {
	align-self: flex-end;
	display: flex;
	align-items: center;
	justify-content: space-between; //! Måske hellere margin-left på tekst?

	padding: 0.5em 1em;
	border-radius: 47px; //! Reactive
	/* Medium Outset Neumorphic */
	box-shadow: 10px 10px 20px #a6abbd, -10px -10px 20px #fafbff;
	background: linear-gradient(
			344.57deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 105.18%
		),
		#ebecf0;
	background-blend-mode: soft-light, normal;

	font-family: Montserrat;
	font-size: 1em;
	color: #6d7587;

	img {
		width: 1.5em;
		margin-right: 0.5em;
	}
}

//! MAKE INTO COMMON CLASSES, NOT JUST ONE FOR EVERY ELEMENT
.title-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.title {
	font-family: Montserrat;
	font-size: 4em;
	color: #222629;
	font-weight: normal;
}

.subtitle {
	font-family: Raleway;
	font-size: 1.75em;
	font-weight: 300;
	color: #6d7587;
	font-style: italic;
}

.start-button {
	margin-bottom: 5%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(
			344.57deg,
			rgba(0, 0, 0, 0.4) 0%,
			rgba(255, 255, 255, 0.4) 105.18%
		),
		#1654f0;
	color: #ebecf0;

	/* Large Outset Neumorphic */
	box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff;
	border-radius: 47px; //! Reactive

	// width: 213px; //! Reactive
	// height: 61px; //! Reactive
	padding: 1rem 2.5rem;

	font-family: Montserrat;
	font-size: 2rem;
	font-weight: 500;
}
</style>