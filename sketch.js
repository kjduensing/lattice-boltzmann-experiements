
const viscosity = 5.5;
const omega = 1 / (3 * viscosity + 0.5);
const flow = 1

class Node {
  constructor(xdis, ydis, probability, density) {
    this.xdis = xdis;
    this.probability = probability;
    this.density = density;
    this.eqDensity = 0;
  }
}

// This is a 1D lattice (D1Q3)
class Lattice {
  constructor(x, y, density) {
    this.x = x;
    this.y = y;
    this.density = density;
    this.ux = 0;
    this.isBarrier = false
    
    this.nodes = [
      // west
      new Node(-1, 1/6, density),
      // center
      new Node(0, 2/3, density),
      // east
      new Node(1, 1/6, density)
    ]
  }

  setUx() {
    this.ux = (this.nodes[2].density - this.nodes[0].density) / this.density
  }
  
  draw() {
    rect(this.x, this.y, 20);
  }
}

function calcEquilibriumDensity(node, latticeSite) {
 
  return (node.probability * latticeSite.density) * (1 + (3 * node.xdis * latticeSite.ux) + (4.5 * Math.pow((node.xdis * latticeSite.ux), 2)) - (1.5 * Math.pow(latticeSite.ux, 2)));
}

function collideSite(latticeSite) {
  let currentLatticeDensity = 0;
  for (let node of latticeSite.nodes) {
    currentLatticeDensity += node.density
  }
  
  latticeSite.density = currentLatticeDensity;
  
  // Calc ux (x velocity)
  latticeSite.setUx();
  for (let node of latticeSite.nodes) {
    node.eqDensity = calcEquilibriumDensity(node, latticeSite);
    
    
    // set node density
    node.density += omega * (node.eqDensity-node.density);
  }
}

function setEquilibrium(latticeSite, newUx, newDensity) {
  if (!newDensity) {
    newDensity = latticeSite.density
  }
  latticeSite.ux = newUx
  for (let node of latticeSite.nodes) {
    node.density = calcEquilibriumDensity(node, latticeSite);
  }
}

const pipe = new Array(12);
const tracers = []

function setup() {
  createCanvas(400, 400);
  
  for (let i = 0; i < pipe.length; i++) {
    pipe[i] = new Lattice(i * (width/pipe.length), height/2, 1)
    setEquilibrium(pipe[i], 0.5, 1)
    tracers.push({x: pipe[i].x, y: pipe[i].y})
  }
}

function mouseClicked() {
  // TODO: figure out last/first barriers eventually
  pipe[pipe.length-2].isBarrier = !pipe[pipe.length-2].isBarrier;
}

function draw() {
  background(220);
  
  for (let lat of pipe) {
    collideSite(lat);
  }
  
  // eastward streaming
  pipe[0].density = pipe[pipe.length - 1].density // wrap around
  for (let i = pipe.length - 1; i > 0; i--) {
    // pipe[i].density = pipe[i-1].density;
    pipe[i].nodes[2].density = pipe[i-1].nodes[2].density
  }
  
  // westward streaming
  pipe[pipe.length - 1].density = pipe[0].density // wrap around
  for (let i = 0; i < pipe.length - 1; i++) {
    pipe[i].nodes[0].density = pipe[i+1].nodes[0].density
  }
  
  for (let i = 1; i < pipe.length - 1; i++) {
    if (pipe[i].isBarrier) {
      pipe[i-1].nodes[2].density = pipe[i].nodes[0].density;
      pipe[i+1].nodes[0].density = pipe[i].nodes[2].density;
    }
  }
  const pipeUXData = [];
  for (let i = 0; i < pipe.length; i++) {
    text(pipe[i].ux.toFixed(2), 20, 20)
    
    pipeUXData.push(`Lattice ${i}: ${pipe[i].ux}`)
    // lat.draw();
    // stroke(0)
    strokeWeight(2)
    rectMode(CENTER)
    
    push()
    noFill()
    rect(pipe[i].x+(width/pipe.length)/2, pipe[i].y, (width/pipe.length), width/pipe.length)
    
    if (pipe[i].isBarrier) {
      stroke('rgba(255,0,0,1)')
      rect(pipe[i].x+(width/pipe.length)/2, pipe[i].y, (width/pipe.length), width/pipe.length)
    }
    pop()
    
    if (tracers[i].x < width) {
      tracers[i].x += pipe[i].ux
    } else {
      tracers[i].x = 0;
    }
    push()
    noFill()
    circle(tracers[i].x, tracers[i].y, 7)
    pop()
    // console.log(tracers[i].x)
    // line(lat.x, lat.y, lat.x + lat.ux, lat.y)
  }
}
