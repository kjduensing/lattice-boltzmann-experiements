const gW = 20;
const gH = 10;
const grid = [];
let cellSize;

function setup() {
	createCanvas(1600, 800);

	for (let i = 0; i < gW; i++) {
		const row = [];
		for (let j = 0; j < gH; j++) {
			row.push(new Site());
		}
		grid.push(row);
	}
	cellSize = width/gW;
}

function draw() {
	//for (let i = 0; i < width; i += width/gW) {
		//for (let j = 0; j < height; j += height/gH) {
			//square(i, j, width/gW)
		//}
	//}

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

	for (let i = gW - 1; i > 0; i--) {
		for (let j = gH - 1; j > 0; j--) {
			const drawx = i * cellSize;
			const drawy = j * cellSize;

			square(drawx, drawy, cellSize);

			// THIS IS STREAMING
			// Note: Need to stream in the right flow direction. like.. 
			// the current site's northern density gets its southern
			// neighbor's northern density
			grid[i][j].displacements.n = grid[i][wrapY(i+1)].displacements.n;
			grid[i][j].displacements.ne = grid[wrapX(i-1)][wrapY(j+1)].displacements.ne;
			grid[i][j].displacements.e = grid[wrapX(i-1)][j].displacements.e;
			grid[i][j].displacements.se = grid[wrapX(i-1)][wrapY(j-1)].displacements.se;
			grid[i][j].displacements.s = grid[i][wrapY(j-1)].displacements.s
			grid[i][j].displacements.sw = grid[wrapX(i+1)][wrapY(j-1)].displacements.sw
			grid[i][j].displacements.w = grid[wrapX(i+1)][j].displacements.sw
			grid[i][j].displacements.nw = grid[wrapX(i+1)][wrapY(j+1)].displacements.nw

			// THIS IS COLLIDING
			grid[i][j].collide();
		}
	}
}
