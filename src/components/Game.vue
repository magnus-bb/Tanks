<template>
  <div class="game-container" :style="cssColorVars">
    <main class="main" :style="menuSize">
      <game-menu :style="menuSize" />

      <game-canvas />
    </main>

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
			darkMode: true,
		}
	},

	computed: {
		cssBgColor() {
			return this.darkMode ? '#020817' : '#394359'
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

		menuSize() {
			return {
				'--width':
					this.$store.state.config.cell.xAmt *
						this.$store.state.config.cell.width +
					'px',
				'--height':
					this.$store.state.config.cell.yAmt *
						this.$store.state.config.cell.width +
					'px',
			}
		},
	},

	methods: {},
	created() {
		// Disables some hotkeys, so ctrl can be used in-game:
		document.addEventListener('keydown', event => {
			if (event.ctrlKey && 'cvxsrpuaz'.indexOf(event.key) !== -1) {
				console.log('Hotkey prevented')
				event.preventDefault()
			}
		})
	},
}
</script>



<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500|Raleway:300i&display=swap');
@import '@/scss/global';

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

button {
	border: none;
	outline: none;
	cursor: pointer;
	user-select: none;
}

.main {
	width: var(--width);
	height: var(--height);
}

.game-container {
	height: 100vh;
	color: var(--text-color);
	background-color: var(--bg-color);
	font-family: Montserrat;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

kbd {
	// margin: 0px 0.1em;
	padding: 0.1em 0.6em;
	border-radius: 3px;
	border: 1px solid rgb(204, 204, 204);
	line-height: 1.4;
	font-family: Arial, Helvetica, sans-serif;
	// font-size: 10px;
	// display: inline-block;
	box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 2px #ffffff;
	background-color: rgb(247, 247, 247);
	// text-shadow: 0 1px 0 #fff;
}

//* Resets:
input[type='range'] {
	appearance: none; /* Hides the slider so that custom slider can be made */
	width: 100%; /* Specific width is required for Firefox. */
	background: transparent; /* Otherwise white in Chrome */
	overflow: hidden;

	&::-webkit-slider-thumb {
		appearance: none;
	}

	&::-moz-range-thumb {
		background: transparent;
		border: none;
	}

	&:focus {
		outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
	}

	&::-ms-track {
		width: 100%;
		cursor: pointer;

		/* Hides the slider so custom styles can be added */
		background: transparent;
		border-color: transparent;
		color: transparent;
	}
}

//* Styling:
input[type='range'] {
	border-radius: 10px;
	overflow: visible;

	&::-webkit-slider-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dee1eb;
		background: linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
		box-shadow: 1px 2px 2px rgba(89, 98, 120, 0.24);
	}
	&::-webkit-slider-runnable-track {
		@include shallow-inset;

		border-radius: 10px;
		height: 10px;
		overflow: visible;
		display: flex;
		align-items: center;
	}

	&::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dee1eb;
		background: linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
		box-shadow: 1px 2px 2px rgba(89, 98, 120, 0.24);
	}
	&::-moz-range-track {
		@include shallow-inset;

		border-radius: 10px;
		height: 10px;
		overflow: visible;
		display: flex;
		align-items: center;
	}
	&::-moz-range-progress {
		height: 10px;
		border-radius: 5px 0 0 5px;
		@include bg(var(--cta-color));
	}

	&::-ms-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dee1eb;
		background: linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
		box-shadow: 1px 2px 2px rgba(89, 98, 120, 0.24);
	}
	&::-ms-track {
		@include shallow-inset;

		border-radius: 10px;
		height: 10px;
		overflow: visible;
		display: flex;
		align-items: center;
	}
	&::-ms-fill-lower {
		height: 10px;
		border-radius: 5px 0 0 5px;
		@include bg(var(--cta-color));
	}
}

input[type='number'] {
	// Resets:
	box-sizing: content-box;
	appearance: textfield;
	outline: none;
	background: none;
	border: none;
	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	@include standard-input;

	@include shallow-inset;
	@include bg(var(--light-text));
	text-align: center;

	border-radius: 15px;
	font-size: 1rem;
	padding: 0.2ch 0.5ch;
	width: 4ch;
}

.configs__checkbox {
	.configs__checkbox-box {
		cursor: pointer;
		display: inline-block;
		height: 15px;
		width: 15px;
		border-radius: 3px;
		@include small-outset;
		@include bg(var(--focus-color));
	}

	input {
		appearance: none;

		&:checked + label .configs__checkbox-box {
			// @include shallow-inset;
			@include bg(var(--cta-color));
		}
	}

	
}
</style>
