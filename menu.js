//* START MENU

$('#start-game').on('click', () => { // TODO: Gray out button if no players
	Game.start() 
})


$('#add-player').on('click', () => { // TODO: Gray out button if no players

	// SET name = INPUT VALUE
	// CLEAR input
	// SET controls = values in object
	// GRAY control input if value is already used?


	Game.addPlayer(name, controls)
})