 // Important to ensure reactivity in external js, by forcing the programme to re-fetch the current state...
// Using a normal getter (not the function, that it is now), does not work, since the local variable referencing the
// getter will not be automatically updated when something else changes state, unless we reference it (e.g. store.state.getters...) directly
export const getters = {
	config: state => () => {
		return state.config
	},

	gameState: state => () => {
		return state.gameState
	},

	gameStatus: state => () => {
		return state.gameStatus
	},

}