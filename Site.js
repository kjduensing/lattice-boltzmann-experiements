class WeightedVelocityVector {
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.weight = w; // aka density
		this.mass = 0.01;
		this.acceleration = createVector(0,0);
		this.velocity = createVector(x,y);
		this.position = createVector(x, y);
	}

	applyForce(forceVector) {
		let force = forceVector.copy()
		force = force.div(this.mass);
		this.acceleration.add(force);
	}

	update() {
		// Velocity changes according to acceleration
		this.velocity.add(this.acceleration);
		// position changes by velocity
		//this.position.add(this.velocity);
		// We must clear acceleration each frame
		this.acceleration.mult(0);
	}
}

class Site {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		//velocity vectors
		this.velocityVectors = {
			c: new WeightedVelocityVector(0, 0, 4/9),
			n: new WeightedVelocityVector(0, -1, 1/9),
			e: new WeightedVelocityVector(1, 0, 1/9),
			s: new WeightedVelocityVector(0, 1, 1/9),
			w: new WeightedVelocityVector(-1, 0, 1/9),
			ne: new WeightedVelocityVector(1, -1, 1/36),
			se: new WeightedVelocityVector(1, 1, 1/36),
			sw: new WeightedVelocityVector(-1, 1, 1/36),
			nw: new WeightedVelocityVector(-1, -1, 1/36),
		}
	}
}
