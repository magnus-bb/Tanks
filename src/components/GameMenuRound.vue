<template>
  <div id="nextRoundMenu" class="round-menu">
    <h2 class="round-menu__message">{{ message }}</h2>
    <div class="choices">
      <button class="choices__button" @click="nextRound" >Next Round</button>
      <button class="choices__button" @click="mainMenu" >Main Menu</button>
    </div>
  </div>
</template>

<script>
import game from '@/game/game.js'

export default {
	name: 'GameMenuRound',
	computed: {
		message() {
			return this.$store.state.gameState.tanks.length > 0
				? `${this.$store.state.gameState.tanks[0].name} won this game!`
				: 'The game was a draw. Try not to kill yourself!'
		},
	},

	methods: {
		nextRound() {
			game.start()
		},

		mainMenu() {
			game.reset()
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/scss/global';

.round-menu {
	width: 60%;
	height: 50%;

	@include window;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
}

.round-menu__message {
	@include h2;
	text-align: center;
}

.choices {
	display: flex;

	.choices__button {
		margin: 0 1em;

		@include bg(var(--light-text));
		@include medium-outset;

		border-radius: 10em; // Completely rounded
		padding: 0.5em 1.5em;

		font-family: Montserrat;
		font-size: 1.3rem;
		color: var(--dark-text);

		&:active {
			@include medium-outset-active;
		}
	}
}
</style>