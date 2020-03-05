<template>
  <div class="status-bar">
    <!-- <button @click="test">Test</button> -->
    <div
      class="status-bar__player-item"
      v-for="player of gameStatus.players"
      :key="player.id"
      :style="{ '--player-color': colorToCss(player.color) }"
    >
      <h2 class="player-item__name">{{ player.name }}</h2>

      <div class="player-item__primary">
        <div class="player-item__equipment" v-if="player.tank.equipment">
          <img :src="require(`@/assets/pickups/${ player.tank.equipment.name }.svg`)" />
        </div>

        <div class="player-item__ammo" v-else>
          <div v-for="ammo in player.tank.ammo">o</div>
        </div>

        <div class="player-item__modifiers">
          <img
            v-for="mod of player.tank.modifiers"
            :src="require(`@/assets/pickups/${ mod.name }.svg`)"
            :key="mod.name"
          />
        </div>
      </div>

      <div class="player-item__hover">
        <div>
          <h5>Wins</h5>
          <p>{{ player.wins }}</p>
        </div>
        <div>
          <h5>Kills</h5>
          <p>{{ player.kills }}</p>
        </div>
        <div>
          <h5>Deaths</h5>
          <p>{{ player.deaths }}</p>
        </div>
        <div>
          <h5>Suicides</h5>
          <p>{{ player.suicides }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'GameStatus',
	data() {
		return {}
	},

	computed: {
		gameStatus() {
			return this.$store.state.gameStatus
		},

		gameState() {
			return this.$store.state.gameState
		},
	},

	methods: {
		colorToCss(array) {
			return `rgb(${array[0]}, ${array[1]}, ${array[2]})`
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
		padding: 1rem;
		border-radius: 5px;
		width: 10em;
		height: 8em;

		display: flex;
		flex-direction: column;
		align-items: center;

		&:hover {
			.player-item__primary {
				display: none;
			}

			.player-item__hover {
				display: grid;
				grid-template: repeat(2, 1fr) / repeat(2, 1fr);
				background: blue;
				height: 100%;
				width: 100%;
				justify-items: center;
				align-items: center;
			}
		}

		.player-item__name {
			grid-area: 1 / 1 / 2 / 5;
		}

		.player-item__primary {
			width: 100%;
			height: 100%;

			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			justify-items: center;
			align-items: center;

			.player-item__equipment,
			.player-item__ammo {
				grid-area: 1 / 1 / 2 / 3;

				display: flex;
				justify-content: center;
				flex-wrap: wrap;

				* {
					margin: 0 0.2rem;
				}
			}

			.player-item__modifiers {
				grid-area: 2 / 1 / 3 / 3;

				display: flex;
				justify-content: space-evenly;
			}
		}

		.player-item__hover {
			display: none;
		}
	}
}
</style>