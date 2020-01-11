class Status {
	static makePlayerSections() {
		Game.players.forEach((player, index) => {
			
		}) 
	}

	static initPlayer(player, ID) {
		const statusBar = $('#statusBar')

		const playerBox = $(`<div id="player-${ID}" class="player-status-container">`)

		const [r, g, b] = player.color
		playerBox.css('background', `rgba(${r}, ${g}, ${b}, 0.3)`) // Perhaps change to use css variables + data-attr

		playerBox.append($(`<h2 class="player-name">${player.name}</h2>`))

		// // playerBox.append($('<div class="player-ammo">•••••</div>'))

		// // const wins = $('<div class="player-wins-container">')
		// // wins.append($('<h4>Wins</h4>'))
		// // wins.append($('<h3 class="player-wins">0</h3>'))
		// // playerBox.append(wins)

		// // const kills = $('<div class="player-kills-container">')
		// // kills.append($('<h4>Kills</h4>'))
		// // kills.append($('<h3 class="player-kills">0</h3>'))
		// // playerBox.append(kills)

		// // const deaths = $('<div class="player-deaths-container">')
		// // deaths.append($('<h4>Deaths</h4>'))
		// // deaths.append($('<h3 class="player-deaths">0</h3>'))
		// // playerBox.append(deaths)

		statusBar.append(playerBox)
	}

	static update(playerId) {
		// const playerBox = $('')
	}

	static clearAll() {
		$('#statusBar').empty()
	}
}