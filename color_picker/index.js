import P5 from 'p5'
// Takes an element to place the listener on
// Optionally if anything with the class is clicked (otherwise it will be the element)
export default function ColorPicker(element, className = null) {
	if (className) {
		element.addEventListener('click', () => {
			if (!event.target.classList.contains(className)) return



		})
	} else {
		element.addEventListener('click', () => {

		})
	}
}

const picker = new P5((sketch) => {
	let colors

	sketch.preload = function() {
		colors = sketch.loadImage('./colors.png')
	}

	sketch.setup = function() {

	}
})