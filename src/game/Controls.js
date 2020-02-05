import store from '@/store'
const { p5 } = store.state
const { gameState, gameStatus } = store.getters

export default class Controls {
	constructor(forward = p5.UP_ARROW, backward = p5.DOWN_ARROW, left = p5.LEFT_ARROW, right = p5.RIGHT_ARROW, fire = 32) {

		this.forward = forward
		this.right = right
		this.backward = backward
		this.left = left
		this.fire = fire

	}
}


// class Controls {
// 	constructor(forward = this.p5.UP_ARROW, backward = this.p5.DOWN_ARROW, left = this.p5.LEFT_ARROW, right = this.p5.RIGHT_ARROW, fire = 32) {
// 		this.forward = forward
// 		this.right = right
// 		this.backward = backward
// 		this.left = left
// 		this.fire = fire
// 	}
// }


// Keyboard handler for firing:
p5.keyPressed = () => { // Cannot be done in class, since we have to listen for all keypresses, and keyIsDown will spam
	if (!gameStatus().paused) {
		for (const tank of gameState().tanks) {
			if (p5.keyCode === tank.controls.fire) {
				tank.fire()
			}
		}
	}

	// // For setting keybindings in the controls section:
	// if ($(':focus').hasClass('key-selector-input')) {

	// 	// Cleans up the key to show:
	// 	if (keyCode === UP_ARROW) key = 'UP'
	// 	else if (keyCode === DOWN_ARROW) key = 'DOWN'
	// 	else if (keyCode === LEFT_ARROW) key = 'LEFT'
	// 	else if (keyCode === RIGHT_ARROW) key = 'RIGHT'
	// 	else if (keyCode === 32) key = 'SPACE'

	// 	// Displays chosen key as value... 
	// 	$(':focus').val(key.toUpperCase())

	// 	// but the key to pass as a binding is in the data-attribute:
	// 	$(':focus').data('keybinding', keyCode)
	// }
}

// Prevents scroll issues:
window.addEventListener('keydown', e => { // Cannot use jQuery without blocking all defaults, for som reason
	// Space and arrow keys:
	if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
		e.preventDefault();
	}
}, false);