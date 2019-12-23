//* START MENU

$('#start-game-button').on('click', () => { // TODO: Gray out button if no players
	Game.new()
})


$('#add-player-button').on('click', () => { // TODO: Gray out button if no players

	// Checks if all fields have been filled:
	const fieldVals = jQuery.map($('.add-player-container input'), inputField => $(inputField).val())
	if (fieldVals.some(val => val === '')) return console.log("Fill out all fields")
	//TODO: FEJLMEDDELELSE OMKRING MANGLENDE FELTER + FEEDBACK PÅ FELT

	const id = Game.players.length // Corresponds to the index num of the player to be added

	const name = $('#player-name-input').val()

	// A bit quirky because of jscolor:
	const color = $('#player-color-button')[0].jscolor.rgb

	// Gets all keybindings from the input fields:
	const keys = jQuery.map($('.key-selector-input'), inputField => $(inputField).data('keybinding'))

	const controls = new Controls(...keys)

	const player = new Player(id, name, color, controls)
	console.log(player)

	Game.addPlayer(player)

	// Resets fields:
	$('.add-player-container input').each(function() {
		$(this).data('keybinding', '')
		$(this).val('')
	})
})


//* PAUSE MENU

$('#resume-game-button').on('click', () => {
	Game.unpause()
})


//* NEXT ROUND MENU

$('#next-round-button').on('click', () => {
	Game.start()
})

