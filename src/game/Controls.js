import store from '@/store'
const { p5 } = store.state
const { gameState, gameStatus } = store.getters

// Keyboard handler for firing:
p5.keyPressed = () => { // Cannot be done in class, since we have to listen for all keypresses, and keyIsDown will spam
	if (!gameStatus().paused) {
		for (const tank of gameState().tanks) {
			if (p5.keyCode === tank.controls.fire) {
				tank.fire()
			}
		}
	}
}

// Prevents scroll issues:
window.addEventListener('keydown', e => { // Cannot use jQuery without blocking all defaults, for som reason
	// Space and arrow keys:
	if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
		e.preventDefault();
	}
}, false);

export default class Controls {
	constructor(forward = p5.UP_ARROW, backward = p5.DOWN_ARROW, left = p5.LEFT_ARROW, right = p5.RIGHT_ARROW, fire = 32) {

		this.forward = forward
		this.right = right
		this.backward = backward
		this.left = left
		this.fire = fire

	}
}