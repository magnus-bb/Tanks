class Controls {
	constructor(forward = UP_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, right = RIGHT_ARROW, fire = 32) {
		this.forward = forward
		this.right = right
		this.backward = backward
		this.left = left
		this.fire = fire
	}
}


// Keyboard handler for firing:
function keyPressed() { // Cannot be done in class, since we have to listen for all keypresses, and keyIsDown will spam
	if (!Game.paused) {
		for (const tank of state.tanks) {
			if (keyCode === tank.controls.fire) {
				tank.fire()
			}
		}
	}

	// For setting keybindings in the controls section:
	if($(':focus').hasClass('key-selector-input')) {

		// Cleans up the key to show:
		if (keyCode === UP_ARROW) key = 'UP'
		else if (keyCode === DOWN_ARROW) key = 'DOWN'
		else if (keyCode === LEFT_ARROW) key = 'LEFT'
		else if (keyCode === RIGHT_ARROW) key = 'RIGHT'
		else if (keyCode === 32) key = 'SPACE'

		// Displays chosen key as value... 
		$(':focus').val(key.toUpperCase())

		// but the key to pass as a binding is in the data-attribute:
		$(':focus').data('keybinding', keyCode)
	}
}

// Prevents scroll issues:
$(window).on("keydown", e => {
	// space and arrow keys
	if([32, 37, 38, 39, 40].includes(e.keyCode)) {
			e.preventDefault();
	}
}, false);