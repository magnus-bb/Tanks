<template>
  <div class="game-container" :style="cssColorVars">
    <game-menu />

    <game-canvas />

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
			darkMode: true
		}
	},

	computed: {
		cssBgColor() {
			return this.darkMode ? this.$store.state.config.wall.color : this.$store.state.config.cell.color
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
	},

	methods: {},
	mounted() {
	},
}
</script>



<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
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
