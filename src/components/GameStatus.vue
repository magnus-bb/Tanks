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
          <h3 class="player-item__h3">Equipment</h3>
          <img :src="require(`@/assets/pickups/${ player.tank.equipment.name }.svg`)" />
        </div>

        <div class="player-item__ammo" v-else>
          <h3 class="player-item__h3">Ammo</h3>
          <div>
            <div v-for="ammo in player.tank.ammo">o</div>
          </div>
        </div>

        <div class="player-item__modifiers">
          <h3 class="player-item__h3">Modifiers</h3>
          <img
            v-for="mod of player.tank.modifiers"
            :src="require(`@/assets/pickups/${ mod.name }.svg`)"
            :key="mod.name"
          />
        </div>
      </div>

      <div class="player-item__hover">
        <div>
          <h3 class="player-item__h3">Wins</h3>
          <p class="player-item__stat">{{ player.wins }}</p>
        </div>
        <div>
          <h3 class="player-item__h3">Kills</h3>
          <p class="player-item__stat">{{ player.kills }}</p>
        </div>
        <div>
          <h3 class="player-item__h3">Deaths</h3>
          <p class="player-item__stat">{{ player.deaths }}</p>
        </div>
        <div>
          <h3 class="player-item__h3">Suicides</h3>
          <p class="player-item__stat">{{ player.suicides }}</p>
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
			return `rgba(${array[0]}, ${array[1]}, ${array[2]})`
		},
	},
}
</script>

<style lang="scss" scoped>
@import '@/scss/global';

.status-bar {
	padding: 1em;
	display: flex;

	.status-bar__player-item {
		@include bg(var(--player-color));
		margin: 0 0.5em;
		padding: 1rem;
		border-radius: 35px;
		width: 12rem;
		height: 10rem;

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
				height: 100%;
				width: 100%;
				justify-items: center;
				align-items: center;
			}
		}

		.player-item__name {
			@include h2;
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
				flex-direction: column;
				justify-content: center;
				flex-wrap: wrap;

				* {
					margin: 0 0.2rem;
				}
			}

			.player-item__modifiers {
				grid-area: 2 / 1 / 3 / 3;

				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
			}
		}

		.player-item__hover {
			display: none;

			div {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
		}

		.player-item__h3 {
			@include h3;
		}

		.player-item__stat {
			@include h2;
		}
	}
}
</style>