let bacteria = [];
let dnaBases = ["A", "T", "C", "G"];

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 10; i++) {
    let bacterium = {
      position: createVector(random(width), random(height)),
      velocity: createVector(random(-1, 1), random(-1, 1)),
      dna: generateDNA(50),
      size: 20,
      limbs: 0,
      speed: 1
    };
    bacteria.push(bacterium);
  }
}

function draw() {
  background(255);
  drawBacteria();
  moveBacteria();
}

function drawBacteria() {
  for (let bacterium of bacteria) {
    fill(0, 255, 0);
    ellipse(bacterium.position.x, bacterium.position.y, bacterium.size, bacterium.size);
    for (let i = 0; i < bacterium.limbs; i++) {
      let angle = TWO_PI / bacterium.limbs * i;
      let x = bacterium.position.x + cos(angle) * bacterium.size;
      let y = bacterium.position.y + sin(angle) * bacterium.size;
      ellipse(x, y, bacterium.size / 2, bacterium.size / 2);
    }
  }
}

function moveBacteria() {
  for (let bacterium of bacteria) {
    bacterium.position.add(p5.Vector.mult(bacterium.velocity, bacterium.speed));
    if (bacterium.position.x < 0 || bacterium.position.x > width) {
      bacterium.velocity.x *= -1;
    }
    if (bacterium.position.y < 0 || bacterium.position.y > height) {
      bacterium.velocity.y *= -1;
    }
    if (random(1) < 0.01) {
      mutate(bacterium);
    }
  }
}

function mousePressed() {
  for (let bacterium of bacteria) {
    let d = dist(mouseX, mouseY, bacterium.position.x, bacterium.position.y);
    if (d < bacterium.size / 2) {
      console.log("DNA Sequence: " + bacterium.dna);
    }
  }
}

function generateDNA(length) {
  let dna = "";
  for (let i = 0; i < length; i++) {
    dna += random(dnaBases);
  }
  return dna;
}

function mutate(bacterium) {
  let mutationType = random(["grow", "speed", "limb"]);
  if (mutationType === "grow") {
    bacterium.size += 5;
  } else if (mutationType === "speed") {
    bacterium.speed += 0.5;
  } else if (mutationType === "limb") {
    bacterium.limbs += 1;
  }
}
