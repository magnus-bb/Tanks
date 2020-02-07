<template>
  <div id="gameMenu" class="menu" v-show="this.showMenu">
    <game-menu-create v-show="showCreateMenu" v-model="configMenuOpen" />
    <game-menu-config v-show="showConfigMenu" v-model="configMenuOpen" />
    <game-menu-round v-show="showRoundMenu" />
    <!-- <game-menu-pause /> -->
  </div>
</template>

<script>
import GameMenuCreate from './GameMenuCreate.vue'
import GameMenuConfig from './GameMenuConfig.vue'
import GameMenuRound from './GameMenuRound.vue'

export default {
	name: 'GameMenu',
	components: {
		GameMenuCreate,
		GameMenuConfig,
		GameMenuRound,
	},
	data() {
		return {
			configMenuOpen: false,
		}
	},

	computed: {
		// paused === some menu is showing:
		showMenu() {
			return this.$store.state.gameStatus.paused
		},

		// not created && config not open === create menu is showing:
		showCreateMenu() {
			return !this.$store.state.gameStatus.created && !this.configMenuOpen
		},

		// configMenu is clicked && game is not created yet === config menu is showing:
		showConfigMenu() {
			return !this.$store.state.gameStatus.created && this.configMenuOpen
		},

		// game is created && round has !started === between rounds menu is showing:
		showRoundMenu() {
			return (
				this.$store.state.gameStatus.created &&
				!this.$store.state.gameStatus.started
			)
		},

		// game is started && also paused === pause menu is showing:
		showPauseMenu() {
			return (
				this.$store.state.gameStatus.paused &&
				this.$store.state.gameStatus.started
			)
		},
	},

	methods: {
		//! Move to wherever pause it to be:
		// import game from '@/game/game.js'
		// pauseGame() {
		// 	game.pause()
		// },
		// unpauseGame() {
		// 	game.unpause()
		// }
	},
}
</script>

<style lang="scss" scoped>
.menu {
	position: absolute;
	z-index: 10;
	width: var(--width);
	height: var(--height);

	background: linear-gradient(
			160.52deg,
			rgba(255, 255, 255, 0),
			rgba(0, 0, 0, 0.15)
		),
		#ebecf0;
	border: 1px solid rgba(255, 255, 255, 0.4);
	box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.25),
		-10px 10px 15px rgba(0, 0, 0, 0.25);
	border-radius: 5px;
}
</style>