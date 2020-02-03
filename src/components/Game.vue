<template>
  <div class="game-container">
    <p>Game Works</p>

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
			
		}
	},
	computed: {},
	methods: {
		
	},
	mounted() {},
}
</script>



<style scoped lang="scss">
</style>
