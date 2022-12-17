const gW = 20;
const gH = 10;
const grid = [];
let cellSize;

function setup() {
	createCanvas(800, 400);

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

	for (let i = 0; i < gW; i++) {
		for (let j = 0; j < gH; j++) {
			const x = i * cellSize;
			const y = j * cellSize;
			const cX = x + cellSize/2;
			const cY = y + cellSize/2;

			square(x, y, cellSize);
			//circle(cX, cY, 10)
			line(
				cX, cY, 
				cX + grid[i][j].velocityVectors.e.velocity.x, 
				cY + grid[i][j].velocityVectors.e.velocity.y);

			Object.values(grid[i][j].velocityVectors).forEach(v => {
				v.applyForce(new p5.Vector(
					Math.random() * (0.01 - -0.01) + -0.01, 
					Math.random() * (0.01 - -0.01) + -0.01).mult(v.weight));
				v.update();
			})
		}
	}
}
