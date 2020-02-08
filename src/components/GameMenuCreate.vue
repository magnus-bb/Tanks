<template>
  <div class="create-menu">
    <section class="add-player-container">
      <input class="player-name-input" type="text" placeholder="Player Name" />
      <div class="controls-container">
        <input type="text" placeholder="Fire" disabled />
        <input type="text" placeholder="Forward" disabled />
        <input type="text" placeholder="Backward" disabled />
        <input type="text" placeholder="Turn Left" disabled />
        <input type="text" placeholder="Turn Right" disabled />
      </div>
			<button class="select-color-button">
				<img src="@/assets/icons/color-tank.svg">
			</button>
      <!-- <div class="select-color-container"></div> -->
      <button class="add-player-button">
        <img src="@/assets/icons/add-player.svg" /> Add Player
      </button>
    </section>

    <section>
      <button class="settings-button" @click="openConfig">
        <img src="@/assets/icons/settings.svg" />Settings
      </button>
      <div class="title-container">
        <h1 class="title">Tanks</h1>
        <h2 class="subtitle">Try Not To Kill Yourself</h2>
      </div>
      <button class="start-button" @click="testStart">Start Game</button>
    </section>
  </div>
</template>

<script>
import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'

export default {
	name: 'GameMenuCreate',
	mixins: [],
	computed: {},
	data() {
		return {}
	},
	methods: {
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
	justify-content: space-evenly;
}

.add-player-container {
	margin: 20px; //! Reactive

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
	cursor: default;

	path {
		cursor: pointer;
	}
}

.add-player-button {
	display: flex;
	align-items: center;
	justify-content: space-evenly; //! Anderledes?

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

.settings-button {
	display: flex;
	align-items: center;
	justify-content: space-evenly; //! Måske hellere margin-right på img?

	width: 89px; //! Reactive
	height: 27px; //! Reactive
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
	font-size: 0.75rem;
	color: #6d7587;
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
	font-size: 3rem;
	color: #222629;
	font-weight: normal;
}

.subtitle {
	font-family: Raleway;
	font-size: 1.125rem;
	font-weight: 300;
	color: #6d7587;
	font-style: italic;
}

.start-button {
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

	width: 213px; //! Reactive
	height: 61px; //! Reactive
	padding: 1rem;

	font-family: Montserrat;
	font-size: 1.5rem;
	font-weight: 500;
}
</style>