<template>
	<div id="gameMenu" class="game-menu">

		<p>Menu Works</p>
		<game-menu-start/>
		<game-menu-config/>
		<game-menu-round/>


	</div>
</template>

<script>

import GameMenuStart from './GameMenuStart.vue'
import GameMenuConfig from './GameMenuConfig.vue'
import GameMenuRound from './GameMenuRound.vue'


	export default {
		name: 'GameMenu',
		components: {
			GameMenuStart,
			GameMenuConfig,
			GameMenuRound,
		}
	}
</script>

<style lang="scss" scoped>

</style>