<template>
  <div class="create-menu">
		<section class="add-player-container">
			<input type="text">
			<button></button>
			
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

.addPlayerContainer {
	margin: 20px;
	background: blue;
}

.settings-button {
	display: flex;
	align-items: center;
	justify-content: space-evenly; //! Måske hellere margin-right på img?

	width: 89px;
	height: 27px;
	border-radius: 47px;
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
	font-weight: normal;
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
	font-size: 18px;
	font-weight: 300;
	color: #6d7587;
	font-style: italic;
}

.start-button {
	background: #1654f0;

	/* Large Outset Neumorphic */
	box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff;
	border-radius: 47px; //! Edit

	width: 213px; //! Edit
	height: 61px; //! Edit
	padding: 1rem;

	font-family: Montserrat;
	font-size: 1.5rem;
	//line-height: 29px;
	display: flex;
	align-items: center;
	justify-content: center;

	color: #ebecf0;
}
</style>