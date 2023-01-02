const gW = 20;
const gH = 20;
const grid = [];
let cellSize;

let showStats = false;

function setup() {
	createCanvas(800, 800);

	for (let i = 0; i < gW; i++) {
		const row = [];
		for (let j = 0; j < gH; j++) {
			row.push(new Site());
		}
		grid.push(row);
	}
	cellSize = width/gW;


	// Init fluid
	for (let i = 0; i < gW; i++) {
		for (let j = 0; j < gH; j++) {
			// setEquil takes velocity vector and density
			// Setting an x flow between 0 and 0.120 works the best
			grid[i][j].setEquil(new p5.Vector(0.120, 0), 1);
		}
	}
}

let gridMouseX = 0;
let gridMouseY = 0;

function mouseDragged() {
	gridMouseX = Math.floor(map(mouseX, 0, width, 0, gW));
	gridMouseY = Math.floor(map(mouseY, 0, height, 0, gH));
	showStats = true;
}

function mouseReleased() {
	showStats = false;
}

function draw() {
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
	
	for (let i = 0; i < gW; i++) {
		for (let j = 0; j < gH; j++) {
			const drawx = i * cellSize;
			const drawy = j * cellSize;

			square(drawx, drawy, cellSize);

			//const boxSize = cellSize/9;
			//for (let d = 0; d < f; d++) {
				//square(drawx + boxSize * (d % 9) , drawy + boxSize * (d / 9), boxSize)
			//}
		}
	}

	//for (let i = gW - 1; i > 0; i--) {
		//for (let j = gH - 1; j > 0; j--) {
	for (let i = 0; i < gW; i++) {
		for (let j = 0; j < gH; j++) {
			// THIS IS COLLIDING
			grid[i][j].collide();

			// THIS IS STREAMING
			// Note: Need to stream in the right flow direction. like.. 
			// the current site's northern density gets its southern
			// neighbor's northern density, etc...
			grid[i][j].displacements.n = grid[i][wrapY(i+1)].displacements.n;
			grid[i][j].displacements.ne = grid[wrapX(i-1)][wrapY(j+1)].displacements.ne;
			grid[i][j].displacements.e = grid[wrapX(i-1)][j].displacements.e;
			grid[i][j].displacements.se = grid[wrapX(i-1)][wrapY(j-1)].displacements.se;
			grid[i][j].displacements.s = grid[i][wrapY(j-1)].displacements.s
			grid[i][j].displacements.sw = grid[wrapX(i+1)][wrapY(j-1)].displacements.sw
			grid[i][j].displacements.w = grid[wrapX(i+1)][j].displacements.sw
			grid[i][j].displacements.nw = grid[wrapX(i+1)][wrapY(j+1)].displacements.nw

		}
	}
	
	if (!showStats) {
		textSize(16);
		text(`[${gridMouseX}, ${gridMouseY}]:`, 10, 10)
		text(`Density: ${grid[gridMouseX][gridMouseY].density.toFixed(2)}`, 10 + 10, 10 + 20)
		text(`Velocity (X): ${grid[gridMouseX][gridMouseY].velocity.x.toFixed(2)}`, 10 + 10, 10 + 40)
		text(`Velocity (Y): ${grid[gridMouseX][gridMouseY].velocity.y.toFixed(2)}`, 10 + 10, 10 + 60)
	}

	// Move left-moving densities to left (not sure why)
	//for (let y = 1; y < gH - 2; y++) {
			//grid[gW-1][y].displacements.w = grid[gW-2][y].displacements.w;
			//grid[gW-1][y].displacements.nw = grid[gW-2][y].displacements.nw;
			//grid[gW-1][y].displacements.sw = grid[gW-2][y].displacements.sw;
	//}
}
