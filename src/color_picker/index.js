import p5 from 'p5'
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

const picker = new p5((sketch) => {
	let colors

	sketch.preload = function() {
		colors = sketch.loadImage('@/color_picker/colors.png')
	}

	sketch.setup = function() {
		sketch.createCanvas(256, 256)
		sketch.image(colors, 0, 0)
	}
})