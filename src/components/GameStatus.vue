<template>
  <div class="status-bar">
    <div
      class="status-bar__player-item"
      v-for="player of gameStatus.players"
      :key="player.id"
      :style="{ '--player-color': colorToCss(player.color) }"
    >
      <h2 class="player-item__name">{{ player.name }}</h2>
      <!-- <div class="player-item__primary"> -->
				
				<div class="test" v-if="player.tank.equipment"></div>
				<!-- <div v-for="ammo of player.tank.ammo">o</div> -->
        <!-- <div class="player-item__equipment">{{ player.tank.equipment }}</div> -->
      <!-- </div> -->

      <div class="player-item__hover">
        <p>{{ player.kills }}</p>
        <p>{{ player.deaths }}</p>
        <p>{{ player.wins }}</p>
        <p>{{ player.suicides }}</p>
      </div>

      <!-- name
			kills,
			deaths
			wins
			suicides
			ammo
			equipment
			modifiers
      -->
    </div>
  </div>
</template>
			<!-- this.id = store.state.gameStatus.players.length //! Players might not need unique ID, now that we can keep track of them with vue
						this.name = name
						this.color = colorArray
						this.controls = controls
						this.wins = 0
						this.deaths = 0
						this.kills = 0
						this.suicides = 0 -->

<script>
// import { hasContent } from '@/game/helpers.js'

export default {
	name: 'GameStatus',
	components: {},
	computed: {
		gameStatus() {
			return this.$store.state.gameStatus
		},

		gameState() {
			return this.$store.state.gameState
		}
	},

	methods: {
		// hasContent,

		colorToCss(array) {
			return `rgb(${array[0]}, ${array[1]}, ${array[2]})` //! Fix babel? so we can use spread operator
		},
	},
}
</script>

<style lang="scss" scoped>
.status-bar {
	padding: 1em;
	display: flex;

	.status-bar__player-item {
		background: var(--player-color);
		margin: 0 0.5em;

		.player-item__name {
		}

		.ammo {

		}

		.player-item__primary {
			.player-item__equipment {
				width: 100px;
				height: 100px;
				background: blue;
			}
		}

		.player-item__hover {
			display: none;
		}
	}
}

.test {
	height: 20px;
	width: 50px;
	background: blue;
}
</style>