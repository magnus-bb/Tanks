//* START MENU

$('#start-game').on('click', () => { // TODO: Gray out button if no players
	Game.start()
})


$('#add-player-button').on('click', () => { // TODO: Gray out button if no players

	// Checks if all fields have been filled:
	const fieldVals = jQuery.map($('.add-player-container input'), inputField => $(inputField).val())
	if (fieldVals.some(val => val === '')) return console.log("Fill out all fields")
	//TODO: FEJLMEDDELELSE OMKRING MANGLENDE FELTER + FEEDBACK PÅ FELT

	const name = $('#player-name-input').val()

	// A bit quirky because of jscolor:
	const color = $('#player-color-button')[0].jscolor.rgb

	// Gets all keybindings from the input fields:
	const keys = jQuery.map($('.key-selector-input'), inputField => $(inputField).data('keybinding'))

	const controls = new Controls(...keys)

	const player = new Player(name, color, controls)
	console.log(player)

	Game.addPlayer(player)
})
