//import { Displacement } from './Site';
const LatticeSite = require('./Site');
const p5 = require('./p5');

describe('Site', () => {
	it('collides good', () => {
		const site = new LatticeSite.Site();

		//  0.81 is max w/ no negatives
		site.setEquil(new p5.Vector(0.81, 0), 1);
		site.collide();

		console.log(site)
	})

	it('is stable over 40 iterations', () => {
		const site = new LatticeSite.Site();

		//  0.81 is max w/ no negatives
		site.setEquil(new p5.Vector(0.81, 0), 1);

		for (let i = 0; i < 140; i++) {
			site.collide();
		}

		console.log(site);
	})
})
