function setup() {
	createCanvas(800, 600);
}

function draw() {
	background(155)

	strokeWeight(5)
	for (h = (height / 6); h < height; h += (height / 6)) {
		line(0, h, width, h)
	}

	for (w = (width / 8); w < width; w += (width / 8)) {
		line(w, 0, w, height)
	}
}