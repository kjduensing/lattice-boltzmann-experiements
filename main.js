const gW = 5;
const grid = [];
let cellSize;

let showStats = false;

function setup() {
	createCanvas(900, 100);

	for (let i = 0; i < gW; i++) {
		grid.push(new Site());
	}

	cellSize = width/gW;

	// Init fluid
	//for (let i = 0; i < gW; i++) {
	//for (let j = 0; j < gH; j++) {
	//// setEquil takes velocity vector and density
	//// Setting an x flow between 0 and 0.120 works the best
	////grid[i][j].setEquil(new p5.Vector(0.120, 0), 1);
	//grid[i][j].setEquil(new p5.Vector(0, 0.07), 1);
	//}
	//}
}

let gridMouseX = 0;
let gridMouseY = 0;

function mouseMoved() {
	gridMouseX = Math.floor(map(mouseX, 0, width, 0, gW));
	showStats = true;
}

//function mouseReleased() {
//showStats = false;
//}

function drawArrow(base, vec, myColor) {
	push();
	stroke(myColor);
	strokeWeight(2);
	fill(myColor);
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	let arrowSize = 4;
	translate(vec.mag() - arrowSize, 0);
	line(0, -arrowSize/2, arrowSize, 0);
	line(0, arrowSize/2, arrowSize, 0);
	pop();
}

function mapColor(density) {
	return map(density, 0, 9, 255, 0);
}

function paint() {
	for (let i = 0; i < gW; i++) {
		const drawx = i * cellSize;
		const drawy = 0;

		push();
		stroke("red");
		strokeWeight(4)
		square(drawx, drawy, cellSize);
		pop();

		drawArrow(createVector(drawx + cellSize/2, drawy + cellSize/2), grid[i].velocity, "#f00");

		push();
		translate(drawx, drawy);
		noFill();
		const boxSize = cellSize/3;
		//for (let dx = 0; dx < 3; dx++) {
		//for (let dy = 0; dy < 3; dy++) {
		//const xpos = drawx + boxSize * dx
		//const ypos = drawy + boxSize * dy

		//square(xpos, ypos, boxSize)
		//}
		//}

		// W
		push();
		fill(mapColor(grid[i].displacements.w.density), 150);
		rect(0, 0, boxSize, cellSize);
		text(grid[i].displacements.w.density, 50, 50)
		pop();
		// C 
		push();
		fill(mapColor(grid[i].displacements.c.density), 150);
		rect(1 * boxSize, 0, boxSize, cellSize);
		pop();
		// E
		push();
		fill(mapColor(grid[i].displacements.e.density), 150);
		rect(2 * boxSize, 0, boxSize, cellSize);
		pop();

		pop();
	}
}

function draw() {
	strokeWeight(0.5)
	background(255);

	paint();

	grid[0].setEquil(createVector(0.120, 0), 1);
	grid[gW-1].setEquil(createVector(0.120, 0), 1);

	// THIS IS COLLIDING
	for (let i = 1; i < gW; i++) {
		grid[i].collide();
	}

	// WHY??
	//grid[gW-1].displacements.w = grid[gW-2].displacements.w;

	// THIS IS STREAMING
	for (let i = 1; i < gW - 1; i++) {
		grid[i].displacements.e = grid[i-1].displacements.e;
		grid[i].displacements.w = grid[i+1].displacements.w
	}


	textSize(16);
	text(`[${gridMouseX}, ${gridMouseY}]:`, 10, 10)
	text(`Omega: ${grid[gridMouseX].OMEGA.toFixed(4)}`, 10 + 10, 10 + 20)
	text(`Density: ${grid[gridMouseX].density.toFixed(4)}`, 10 + 10, 10 + 40)
	text(`Velocity (X): ${grid[gridMouseX].velocity.x.toFixed(4)}`, 10 + 10, 10 + 60)
	text(`Velocity (Y): ${grid[gridMouseX].velocity.y.toFixed(4)}`, 10 + 10, 10 + 80)
}
