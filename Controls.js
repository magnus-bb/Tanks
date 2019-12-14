class Controls {
	constructor(forward = UP_ARROW, right = RIGHT_ARROW, backward = DOWN_ARROW, left = LEFT_ARROW, fire = 32) {
		this.forward = forward
		this.right = right
		this.backward = backward
		this.left = left
		this.fire = fire
	}
}

// Keyboard handler for firing:
function keyPressed() { // Cannot be done in class, since we have to listen for all keypresses, and keyDown will spam
	if (!Game.paused) {
		for (const tank of state.tanks) {
			if (keyCode === tank.controls.fire) {
				tank.fire()
			}
		}
	}
}