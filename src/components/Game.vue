<template>
  <div class="game-container">
    <div class="test">
      <button @click="testStart">Test Start</button>
      <button @click="createPickup('m82')">M82</button>
      <button @click="createPickup('wormhole')">Wormhole</button>
      <button @click="createPickup('breaker')">Breaker</button>
      <button @click="createPickup('ammo')">Ammo</button>
      <button @click="createPickup('stealthAmmo')">Stealth Ammo</button>
      <button @click="createPickup('shrinkRay')">Shrink Ray</button>
    </div>

    <main class="main" :style="menuSize">
      <game-menu :style="menuSize" />

      <game-canvas />
    </main> 

    <game-status />
  </div>
</template>



<script>
import Pickup from '@/game/Pickups.js'
import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'

//* Components:
import GameMenu from './GameMenu.vue'
import GameCanvas from './GameCanvas.vue'
import GameStatus from './GameStatus.vue'

export default {
	name: 'Game',
	props: {},
	components: {
		GameMenu,
		GameCanvas,
		GameStatus,
	},

	// data() {
	// 	return {
	// 		darkMode: true,
	// 	}
	// },

	computed: {
	// 	cssBgColor() {
	// 		return this.darkMode ? '#020817' : '#394359'
	// 	},

	// 	cssTextColor() {
	// 		return this.darkMode ? 'white' : 'black'
	// 	},

	// 	cssColorVars() {
	// 		return {
	// 			'--text-color': this.cssTextColor,
	// 			'--bg-color': this.cssBgColor,
	// 		}
	// 	},

		menuSize() {
			return {
				'--width':
					this.$store.state.config.cell.xAmt *
						this.$store.state.config.cell.width +
					'px',
				'--height':
					this.$store.state.config.cell.yAmt *
						this.$store.state.config.cell.width +
					'px',
			}
		},
	},

	methods: {
		//! For game logic testing:
		testStart() {
			game.addPlayer(
				new Player('One', [255, 0, 0], new Controls(69, 68, 83, 70, 86))
			)

			game.addPlayer(new Player('Other', [0, 255, 0], new Controls()))
			game.new()
		},

		createPickup(name) {
			Pickup.create(name)
		},
	},

	created() {
		// Disables some hotkeys, so ctrl can be used in-game:
		document.addEventListener('keydown', event => {
			if (event.ctrlKey && 'cvxsrpuaz'.indexOf(event.key) !== -1) {
				console.log('Hotkey prevented')
				event.preventDefault()
			}
		})
	},
}
</script>



<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500|Raleway:300i&display=swap');
@import '@/scss/global';

:root {
	// Global variables:
	--cta-color: #1654f0;
	--warning-color: #730f0f;
	--focus-color: #dfe6ff;
	--light-text: #ebecf0;
	--dark-text: #6d7587;
	--darkest-text: #222629;

	// --bg-dark: #020817;
	// --bg-light: #394359;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background: var(--darkest-text);
}

.game-container {
	height: 100vh;
	color: var(--text-color);
	font-family: Montserrat;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}


button {
	border: none;
	outline: none;
	cursor: pointer;
	user-select: none;
}

.main {
	width: var(--width);
	height: var(--height);
}

kbd {
	// margin: 0px 0.1em;
	padding: 0.1em 0.6em;
	border-radius: 3px;
	border: 1px solid rgb(204, 204, 204);
	line-height: 1.4;
	font-family: Arial, Helvetica, sans-serif;
	// font-size: 10px;
	// display: inline-block;
	box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 2px #ffffff;
	background-color: rgb(247, 247, 247);
	// text-shadow: 0 1px 0 #fff;
}

//! Fjern ved prod
.test {
	display: flex;

	button {
		margin: 0 15px 5px;
		padding: 0.2em 0.5em;
		border-radius: 3px;
		font-family: inherit;
		@include bg(var(--dark-text));
	}
}
</style>
