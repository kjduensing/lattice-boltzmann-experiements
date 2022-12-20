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

class Displacement {
	constructor(weight, velocityVector) {
		this.weight = weight;
		this.equil = 1;
		this.density = 1;
		this.velocity = velocityVector
	}

	equilibrate(density, macroVelocity) {
		const equilibrium = 
			density * this.weight * 
			(
				1 + this.velocity.mult(3).dot(macroVelocity) +
				(9/2) * Math.pow(this.velocity.dot(macroVelocity), 2) -
				(3/2) * macroVelocity.magSq()
			);

		// No idea what this does, except it's the 1/T in the equations...
	  const omega = 1/(3*1+0.5)
	
		this.equil += omega * (equilibrium - this.equil);
	}
}

class Site {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.displacements = {
			c: new Displacement(4/9, new p5.Vector(0, 0)),
			n: new Displacement(1/9, new p5.Vector(0, -1)),
			e: new Displacement(1/9, new p5.Vector(1, 0)),
			s: new Displacement(1/9, new p5.Vector(0, 1)),
			w: new Displacement(1/9, new p5.Vector(-1, 0)),
			ne: new Displacement(1/36, new p5.Vector(1, -1)),
			se: new Displacement(1/36, new p5.Vector(1, 1)),
			sw: new Displacement(1/36, new p5.Vector(-1, 1)),
			nw: new Displacement(1/36, new p5.Vector(-1, -1)),
		}

		//this.densityProbabilities = {
			//c: 1, n: 1, e: 1, s: 1, w: 1, ne: 1, se: 1, sw: 1, nw: 1,
		//}
	}
	
	density() {
		return Object.values(this.displacements).reduce((acc, d) => { 
			acc += d.density; acc; 
		}, 0)
	}

	macroXVelocity() {
		return (
			// All the rightward x directions
			this.displacements.e.density +
			this.displacements.ne.density +
			this.displacements.se.density
		) - (
			// All the leftward x directions
			this.displacements.w.density+
			this.displacements.nw.density + 
			this.displacements.sw.density
		) / this.density();
	}

	macroYVelocity() {
		return (
			// All the downward y directions
			this.displacements.s.density +
			this.displacements.se.density +
			this.displacements.sw.density
		) - (
			// All the upward y directions
			this.displacements.n.density +
			this.displacements.ne.density + 
			this.displacements.nw.density
		) / this.density();
	}

	macroFlow() {
		return new p5.Vector(macroXVelocity(), macroYVelocity());
	}

	collide() {
		Object.values(this.displacements).forEach((d) => {
			d.equilibrate(this.density(), new p5.Vector(this.macroXVelocity(), this.macroYVelocity()));
		})
	}
}

