const gW = 50;
const gH = 25;
const grid = [];
let cellSize;
const flowSpeed = 0.120;

let showStats = false;

function setup() {
	createCanvas(1000, 600);

	for (let i = 0; i < gW; i++) {
		const col = [];
		for (let j = 0; j < gH; j++) {
			col.push(new Site());
		}
		grid.push(col);
	}

	cellSize = width/gW;

	// Init fluid
	for (let j = 0; j < gH; j++) {
		for (let i = 0; i < gW; i++) {
			// setEquil takes velocity vector and density
			// Setting an x flow between 0 and 0.120 works the best
			//grid[i][j].setEquil(new p5.Vector(0.120, 0), 1);
			grid[i][j].setEquil(new p5.Vector(flowSpeed, 0.00), 1);
		}
	}
}

let gridMouseX = 0;
let gridMouseY = 0;

function mouseMoved() {
	gridMouseX = Math.floor(map(mouseX, 0, width, 0, gW));
	gridMouseY = Math.floor(map(mouseY, 0, height, 0, gH));
	showStats = true;
}

function mouseClicked() {
	console.log(grid[gridMouseX][gridMouseY]);
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
	return  map(density, 0, 3, 255, 0);
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
			push();
			fill(mapColor(grid[i][j].displacements.nw.density), 100);
			square(0, 0, boxSize);
			pop();
			// N
			push();
			fill(mapColor(grid[i][j].displacements.n.density), 100);
			square(1 * boxSize, 0, boxSize);
			pop();
			// NE
			push();
			fill(mapColor(grid[i][j].displacements.ne.density), 100);
			square(2 * boxSize, 0, boxSize);
			pop();
			// W
			push();
			fill(mapColor(grid[i][j].displacements.w.density), 100);
			square(0, 1 * boxSize, boxSize);
			pop();
			// C 
			push();
			fill(mapColor(grid[i][j].displacements.c.density), 100);
			square(1 * boxSize, 1 * boxSize, boxSize);
			pop();
			// E
			push();
			fill(mapColor(grid[i][j].displacements.e.density), 100);
			square(2 * boxSize, 1 * boxSize, boxSize);
			pop();
			// SW
			push();
			fill(mapColor(grid[i][j].displacements.sw.density), 100);
			square(0, 2 * boxSize, boxSize);
			pop();
			// S 
			push();
			fill(mapColor(grid[i][j].displacements.s.density), 100);
			square(1 * boxSize, 2 * boxSize, boxSize);
			pop();
			// SE
			push();
			fill(mapColor(grid[i][j].displacements.se.density), 100);
			square(2 * boxSize, 2 * boxSize, boxSize);
			pop();

			pop();
		}
	}
}

function stream() {
	for (let x = 1; x < gW - 1; x++) {
		for (let y = 1; y < gH - 1; y++) {
			grid[x][y].displacements.n.density = grid[x][(y+1)].displacements.n.density;
			grid[x][y].displacements.nw.density = grid[(x+1)][(y+1)].displacements.nw.density;
		}
	}

	for (let x = gW - 2; x > 0; x--) {
		for (let y = 1; y < gH - 1; y++) {
			grid[x][y].displacements.e.density = grid[(x-1)][y].displacements.e.density;
			grid[x][y].displacements.ne.density = grid[(x-1)][(y+1)].displacements.ne.density;
		}
	}

	for (let x = gW - 2; x > 0; x--) {
		for (let y = gH - 2; y > 0; y--) {
			grid[x][y].displacements.s.density = grid[x][(y-1)].displacements.s.density;
			grid[x][y].displacements.se.density = grid[(x-1)][(y-1)].displacements.se.density;
		}
	}

	for (let x = 1; x < gW - 1; x++) {
		for (let y = gH - 2; y > 0; y--) {
			grid[x][y].displacements.w.density = grid[(x+1)][y].displacements.w.density;
			grid[x][y].displacements.sw.density = grid[(x+1)][(y-1)].displacements.sw.density;
		}
	}
}

function draw() {
	strokeWeight(0.5)
	background(255);

	// Set boundaries
	for (let i = 0; i < gW; i++) {
		grid[i][0].setEquil(createVector(flowSpeed, 0), 1);
		grid[i][gH-1].setEquil(createVector(flowSpeed, 0), 1);
	}

	for (let j = 0; j < gH; j++) {
		grid[0][j].setEquil(createVector(flowSpeed, 0), 1);
		grid[gW-1][j].setEquil(createVector(flowSpeed, 0), 1);
	}

	paint();

	for (let x = 0; x < 40; x++) {
		// THIS IS COLLIDING
		for (let j = 1; j < gH - 1; j++) {
			for (let i = 1; i < gW - 1; i++) {
				grid[i][j].collide();
			}
		}

		//for (let k = 1; k < gH - 2; k++) {
			//grid[gW-1][k].displacements.w.density = grid[gW-2][k].displacements.w.density;
			//grid[gW-1][k].displacements.nw.density = grid[gW-2][k].displacements.nw.density;
			//grid[gW-1][k].displacements.sw.density = grid[gW-2][k].displacements.sw.density;
		//}

		stream();
	}

	textSize(16);
	text(`[${gridMouseX}, ${gridMouseY}]:`, 10, 10)
	text(`Omega: ${grid[gridMouseX][gridMouseY].OMEGA.toFixed(4)}`, 10 + 10, 10 + 20)
	text(`Density: ${grid[gridMouseX][gridMouseY].density.toFixed(4)}`, 10 + 10, 10 + 40)
	text(`Velocity (X): ${grid[gridMouseX][gridMouseY].velocity.x.toFixed(4)}`, 10 + 10, 10 + 60)
	text(`Velocity (Y): ${grid[gridMouseX][gridMouseY].velocity.y.toFixed(4)}`, 10 + 10, 10 + 80)

	//let dString = [];
	//for(let d in grid[gridMouseX][gridMouseY].displacements) {
		//console.log(d);
		//dString.push(`${d}: ${grid[gridMouseX][gridMouseY].displacements[d].toFixed(4)}`);
	//}

	//text(`Densities: { ${dString.join(",")} }`, 10 + 10, 10 + 100);
}
