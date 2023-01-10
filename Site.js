class Displacement {
	constructor(weight, allowedVelocityVector) {
		this.weight = weight;
		this.density = weight;
		this.velocity = allowedVelocityVector;
	}

	equilibrate = (macroDensity, macroVelocity) => {
		const equilibriumDensity = 
			macroDensity * this.weight * 
			(
				1 + this.velocity.copy().mult(3).dot(macroVelocity) +
				(9/2) * Math.pow(this.velocity.dot(macroVelocity), 2) -
				(3/2) * macroVelocity.magSq()
			);

		return equilibriumDensity;
	}
}

class Site {
	constructor(x, y) {
		// No idea what this does, except it's the 1/T in the equations...
		// The middle term between 3 and 0.5 is the viscosity
		this.OMEGA = 1/(3*.005+0.5)

		this.velocity = new p5.Vector(0,0);
		this.density = 1;
		this.isBarrier = false;
		this.x = x;
		this.y = y;
		this.displacements = {
			c: new Displacement(4/9, new p5.Vector(0, 0)),
			n: new Displacement(1/9, new p5.Vector(0, 1)),
			e: new Displacement(1/9, new p5.Vector(1, 0)),
			s: new Displacement(1/9, new p5.Vector(0, -1)),
			w: new Displacement(1/9, new p5.Vector(-1, 0)),
			ne: new Displacement(1/36, new p5.Vector(1, 1)),
			se: new Displacement(1/36, new p5.Vector(1, -1)),
			sw: new Displacement(1/36, new p5.Vector(-1, -1)),
			nw: new Displacement(1/36, new p5.Vector(-1, 1)),
		}
	}

	calcDensity = () => {
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
			this.displacements.w.density +
			this.displacements.nw.density + 
			this.displacements.sw.density
		)) / this.density;
	}

	macroYVelocity = () => {
		return ((
			// All the upward y directions
			this.displacements.n.density +
			this.displacements.ne.density + 
			this.displacements.nw.density
		) - (
			// All the downward y directions
			this.displacements.s.density +
			this.displacements.se.density +
			this.displacements.sw.density
		)) / this.density;
	}
	
	collide = () => {
		this.density = this.calcDensity();
		this.velocity.set(this.macroXVelocity(), this.macroYVelocity());
		Object.values(this.displacements).forEach((d) => {
			const equilDensity = d.equilibrate(this.density, this.velocity);
			d.density += this.OMEGA * (equilDensity - d.density)
		})
	}

	setEquil = (velocityVector, density) => {
		this.density = density;
		this.velocity = velocityVector.copy();
		Object.values(this.displacements).forEach((d) => {
			d.density = d.equilibrate(this.density, this.velocity);
		})
	}
}

module.exports = {
	Site,
	Displacement
}

