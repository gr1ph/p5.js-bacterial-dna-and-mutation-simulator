let bacteria = [];
let food = [];
let dnaBases = ["A", "T", "C", "G"];
let gravity = 0.1;

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 10; i++) {
    let bacterium = {
      position: createVector(random(width), random(height)),
      velocity: createVector(random(-1, 1), random(-1, 1)),
      dna: generateDNA(50),
      size: 20,
      limbs: 0,
      speed: 1,
      color: color(0, 255, 0),
      age: 0,
      energy: 100
    };
    bacteria.push(bacterium);
  }
  for (let i = 0; i < 20; i++) {
    food.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(255);
  drawFood();
  drawBacteria();
  moveBacteria();
  applyGravity();
  checkCollisions();
  ageBacteria();
  checkFood();
  reproduceBacteria();
}

function drawFood() {
  fill(255, 0, 0);
  for (let f of food) {
    ellipse(f.x, f.y, 5, 5);
  }
}

function drawBacteria() {
  for (let bacterium of bacteria) {
    fill(bacterium.color);
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

function applyGravity() {
  for (let bacterium of bacteria) {
    bacterium.position.y += gravity;
    if (bacterium.position.y > height) {
      bacterium.position.y = height;
      bacterium.velocity.y *= -1;
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < bacteria.length; i++) {
    for (let j = i + 1; j < bacteria.length; j++) {
      let d = dist(bacteria[i].position.x, bacteria[i].position.y, bacteria[j].position.x, bacteria[j].position.y);
      if (d < (bacteria[i].size + bacteria[j].size) / 2) {
        bacteria[i].velocity.mult(-1);
        bacteria[j].velocity.mult(-1);
        mutate(bacteria[i]);
        mutate(bacteria[j]);
      }
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
  let mutationType = random(["grow", "speed", "limb", "shrink", "slow", "color"]);
  if (mutationType === "grow") {
    bacterium.size += 5;
  } else if (mutationType === "speed") {
    bacterium.speed += 0.5;
  } else if (mutationType === "limb") {
    bacterium.limbs += 1;
  } else if (mutationType === "shrink") {
    bacterium.size = max(5, bacterium.size - 5);
  } else if (mutationType === "slow") {
    bacterium.speed = max(0.5, bacterium.speed - 0.5);
  } else if (mutationType === "color") {
    bacterium.color = color(random(255), random(255), random(255));
  }
}

function ageBacteria() {
  for (let bacterium of bacteria) {
    bacterium.age += 1;
    bacterium.energy -= 0.1;
    if (bacterium.age > 500) {
      bacterium.size = max(5, bacterium.size - 0.1);
    }
  }
}

function checkFood() {
  for (let bacterium of bacteria) {
    for (let i = food.length - 1; i >= 0; i--) {
      let d = dist(bacterium.position.x, bacterium.position.y, food[i].x, food[i].y);
      if (d < bacterium.size / 2) {
        bacterium.energy += 50;
        food.splice(i, 1);
        food.push(createVector(random(width), random(height)));
      }
    }
  }
}

function reproduceBacteria() {
  for (let bacterium of bacteria) {
    if (bacterium.energy > 200) {
      let newBacterium = {
        position: bacterium.position.copy(),
        velocity: createVector(random(-1, 1), random(-1, 1)),
        dna: mutateDNA(bacterium.dna),
        size: bacterium.size,
        limbs: bacterium.limbs,
        speed: bacterium.speed,
        color: bacterium.color,
        age: 0,
        energy: 100
      };
      bacteria.push(newBacterium);
      bacterium.energy = 100;
    }
  }
}

function mutateDNA(dna) {
  let newDNA = "";
  for (let i = 0; i < dna.length; i++) {
    if (random(1) < 0.01) {
      newDNA += random(dnaBases);
    } else {
      newDNA += dna[i];
    }
  }
  return newDNA;
}
