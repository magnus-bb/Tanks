<template>
  <div class="status-bar">
		<div class="status-bar__player-item" v-for="player of gameStatus.players" :key="player.id" :style="{ backgroundColor: player.color }">
			<h2>{{ player.name }}</h2>
			<p>{{player.color}}</p>
			
		</div>
  </div>
</template>
			<!-- this.id = store.state.gameStatus.players.length //! Players might not need unique ID, now that we can keep track of them with vue
						this.name = name
						this.color = colorArray
						this.controls = controls
						this.wins = 0
						this.deaths = 0
						this.kills = 0 -->

<script>

export default {
	name: 'GameStatus',
	components: {},
	computed: {
		gameStatus() {
			return this.$store.state.gameStatus
		},
	},

	methods: {
		colorToCss(array) {
			// return `rgb(${...array})`
		}
	}
}
</script>

<style lang="scss" scoped>
.status-bar {
	padding: 1em;
	display: flex;

	.status-bar__player-item {
		background: red;
		margin: 0 0.5em;
	}
}
</style>