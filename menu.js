//* START MENU

$('#startGameButton').on('click', () => { // TODO: Gray out button if no players
	Game.new()
})


$('#addPlayerButton').on('click', () => { // TODO: Gray out button if no players

	// Checks if all fields have been filled:
	const fieldVals = jQuery.map($('#addPlayerContainer input'), inputField => $(inputField).val())
	if (fieldVals.some(val => val === '')) return console.log("Fill out all fields")
	//TODO: FEJLMEDDELELSE OMKRING MANGLENDE FELTER + FEEDBACK PÅ FELT

	const id = Game.players.length // Corresponds to the index num of the player to be added

	const name = $('#playerNameInput').val()

	// A bit quirky because of jscolor:
	const color = $('#playerColorButton')[0].jscolor.rgb

	// Gets all keybindings from the input fields:
	const keys = jQuery.map($('.key-selector-input'), inputField => $(inputField).data('keybinding'))

	const controls = new Controls(...keys)

	const player = new Player(id, name, color, controls)
	console.log(player)

	Game.addPlayer(player)

	// Resets fields:
	$('#addPlayerContainer input').each(function() {
		$(this).data('keybinding', '')
		$(this).val('')
	})
})

//* NEXT ROUND MENU

$('#nextRoundButton').on('click', () => {
	Game.start()
})

