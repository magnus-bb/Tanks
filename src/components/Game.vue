<template>
  <div class="game-container" :style="cssColorVars">
    <main class="main" :style="menuSize">
      <game-menu :style="menuSize" />

      <game-canvas />
    </main>

    <game-status />
  </div>
</template>



<script>
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

	data() {
		return {
			darkMode: true,
		}
	},

	computed: {
		cssBgColor() {
			return this.darkMode ? '#020817' : '#394359'
		},

		cssTextColor() {
			return this.darkMode ? 'white' : 'black'
		},

		cssColorVars() {
			return {
				'--text-color': this.cssTextColor,
				'--bg-color': this.cssBgColor,
			}
		},

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

	methods: {},
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

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
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

.game-container {
	height: 100vh;
	color: var(--text-color);
	background-color: var(--bg-color);
	font-family: Montserrat;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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


</style>
