const gW = 20;
const gH = 10;
const grid = [];
let cellSize;

let showStats = false;

function setup() {
	createCanvas(900, 400);

	for (let i = 0; i < gW; i++) {
		const col = [];
		for (let j = 0; j < gH; j++) {
			col.push(new Site());
		}
		grid.push(col);
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
	gridMouseY = Math.floor(map(mouseY, 0, height, 0, gH));
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
	return  map(density, 0, 1/9, 255, 0);
}

function paint() {
	for (let i = 0; i < gW; i++) {
		for (let j = 0; j < gH; j++) {
			const drawx = i * cellSize;
			const drawy = j * cellSize;

			push();
			stroke("red");
			strokeWeight(4)
			square(drawx, drawy, cellSize);
			pop();

			drawArrow(createVector(drawx + cellSize/2, drawy + cellSize/2), grid[i][j].velocity, "#f00");

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


			// NW
			//push();
			//fill(mapColor(grid[i][j].displacements.nw.density));
			//square(0, 0, boxSize);
			//pop();
			//// N
			//push();
			//fill(mapColor(grid[i][j].displacements.n.density));
			//square(1 * boxSize, 0, boxSize);
			//pop();
			//// NE
			//push();
			//fill(mapColor(grid[i][j].displacements.ne.density));
			//square(2 * boxSize, 0, boxSize);
			//pop();
			//// W
			//push();
			//fill(mapColor(grid[i][j].displacements.w.density));
			//square(0, 1 * boxSize, boxSize);
			//pop();
			//// C 
			//push();
			//fill(mapColor(grid[i][j].displacements.c.density));
			//square(1 * boxSize, 1 * boxSize, boxSize);
			//pop();
			//// E
			//push();
			//fill(mapColor(grid[i][j].displacements.e.density));
			//square(2 * boxSize, 1 * boxSize, boxSize);
			//pop();
			//// SW
			//push();
			//fill(mapColor(grid[i][j].displacements.sw.density));
			//square(0, 1 * boxSize, boxSize);
			//pop();
			//// S 
			//push();
			//fill(mapColor(grid[i][j].displacements.s.density));
			//square(1 * boxSize, 2 * boxSize, boxSize);
			//pop();
			//// SE
			//push();
			//fill(mapColor(grid[i][j].displacements.se.density));
			//square(2 * boxSize, 2 * boxSize, boxSize);
			//pop();

			pop();
		}
	}
}

function draw() {
	strokeWeight(0.5)
	background(255);

	function wrapX(x) {
		if (x <= 0) return gW - 1;
		if (x > gW - 1) return 0;
		return x;
	}

	function wrapY(y) {
		if (y <= 0) return gH - 1;
		if (y > gH - 1) return 0;
		return y;
	}

	paint();

	// Set boundaries
	for (let i = 0; i < gW; i++) {
		grid[i][0].setEquil(createVector(0.120, 0), 1);
		grid[i][gH-1].setEquil(createVector(0.120, 0), 1);
	}

	for (let j = 0; j < gH; j++) {
		grid[0][j].setEquil(createVector(0.120, 0), 1);
		grid[gW-1][j].setEquil(createVector(0.120, 0), 1);
	}

	for (let x = 0; x < 20; x++) {
		// THIS IS COLLIDING
		for (let i = 0; i < gW; i++) {
			for (let j = 0; j < gH; j++) {
				grid[i][j].collide();
			}
		}

		for (let i = 1; i < gW - 1; i++) {
			for (let j = 1; j < gH - 1; j++) {
				// Note: Need to stream in the right flow direction. like.. 
				// the current site's northern density gets its southern
				// neighbor's northern density, etc...
				grid[i][j].displacements.n = grid[i][(j+1)].displacements.n;
				grid[i][j].displacements.ne = grid[(i-1)][(j+1)].displacements.ne;
				grid[i][j].displacements.e = grid[(i-1)][j].displacements.e;
				grid[i][j].displacements.se = grid[(i-1)][(j-1)].displacements.se;
				grid[i][j].displacements.s = grid[i][(j-1)].displacements.s
				grid[i][j].displacements.sw = grid[(i+1)][(j-1)].displacements.sw
				grid[i][j].displacements.w = grid[(i+1)][j].displacements.w
				grid[i][j].displacements.nw = grid[(i+1)][(j+1)].displacements.nw
			}
		}
	}

	textSize(16);
	text(`[${gridMouseX}, ${gridMouseY}]:`, 10, 10)
	text(`Omega: ${grid[gridMouseX][gridMouseY].OMEGA.toFixed(4)}`, 10 + 10, 10 + 20)
	text(`Density: ${grid[gridMouseX][gridMouseY].density.toFixed(4)}`, 10 + 10, 10 + 40)
	text(`Velocity (X): ${grid[gridMouseX][gridMouseY].velocity.x.toFixed(4)}`, 10 + 10, 10 + 60)
	text(`Velocity (Y): ${grid[gridMouseX][gridMouseY].velocity.y.toFixed(4)}`, 10 + 10, 10 + 80)
}
