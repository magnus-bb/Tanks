<template>
	<div id="nextRoundMenu" class="round-menu">
		<p>round</p>
		<button @click="nextRound" >Next Round</button>

	</div>
</template>

<script>
import game from '@/game/game.js'

	export default {
		name: "GameMenuRound",
		methods: {
			nextRound() {
				game.start()
			}
		}
	}
</script>

<style lang="scss" scoped>
.round-menu {
	background: green;
	// position: absolute;
	height: 20px;
}
</style>