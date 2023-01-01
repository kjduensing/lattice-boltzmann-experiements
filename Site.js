class Displacement {
	constructor(weight, velocityVector) {
		this.weight = weight;
		this.density = 1;
		this.velocity = velocityVector;
	}

	equilibrate = (macroDensity, macroVelocity) => {

		const a = macroDensity * this.weight;
		const b = 1 + this.velocity.mult(3).dot(macroVelocity);
		const c = (9/2) * Math.pow(this.velocity.dot(macroVelocity), 2);
		const d = (3/2) * macroVelocity.magSq();
		
		//console.log(a)
		//console.log(b)
		//console.log(c)
		//console.log(d)
		//console.log()

		const equilibriumDensity = 
			macroDensity * this.weight * 
			(
				1 + this.velocity.mult(3).dot(macroVelocity) +
				(9/2) * Math.pow(this.velocity.dot(macroVelocity), 2) -
				(3/2) * macroVelocity.magSq()
			);

		// No idea what this does, except it's the 1/T in the equations...
		const omega = 1/(3*0.015+0.5)
	
			//console.log(equilibrium)
		this.density += omega * (equilibriumDensity - this.density);
		debugger
	}
}

class Site {
	constructor(x, y) {
		this.isBarrier = false;
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
			sw: new Displacement(1/36, new p5.Vector(1, -1)),
			nw: new Displacement(1/36, new p5.Vector(-1, -1)),
		}
	}

	density = () => {
		return Object.values(this.displacements).reduce((acc, d) => { 
			acc += d.density; 
			return acc; 
		}, 0)
	}

	macroXVelocity = () => {
		return ((
			// All the rightward x directions
			this.displacements.e.density +
			this.displacements.ne.density +
			this.displacements.se.density
		) - (
			// All the leftward x directions
			this.displacements.w.density+
			this.displacements.nw.density + 
			this.displacements.sw.density
		)) / this.density();
	}

	macroYVelocity = () => {
		return ((
			// All the downward y directions
			this.displacements.s.density +
			this.displacements.se.density +
			this.displacements.sw.density
		) - (
			// All the upward y directions
			this.displacements.n.density +
			this.displacements.ne.density + 
			this.displacements.nw.density
		)) / this.density();
	}

	macroFlow = () => {
		return new p5.Vector(this.macroXVelocity(), this.macroYVelocity());
	}
	
	bounce = () => {
		Object.values(this.displacements).forEach((d) => {
		})
	}

	collide = () => {
		Object.values(this.displacements).forEach((d) => {
			d.equilibrate(this.density(), this.macroFlow());
		})
	}
}

