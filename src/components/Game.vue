<template>
  <div class="game-container" :style="cssColorVars">
    <main>
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
				console.log('prevented')
				event.preventDefault()
			}
		})
	},
}
</script>



<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500|Raleway:300i&display=swap');

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

.game-container {
	height: 100vh;
	color: var(--text-color);
	background-color: var(--bg-color);

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
