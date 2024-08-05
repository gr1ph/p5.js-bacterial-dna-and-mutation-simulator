let bacteria = [];
let food = [];
let predators = [];
let dnaBases = ["A", "T", "C", "G"];
let gravity = 0.1;
let tickSpeed = 1;

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
      energy: 100,
    };
    bacteria.push(bacterium);
  }
  for (let i = 0; i < 20; i++) {
    food.push(createVector(random(width), random(height)));
  }

  // Add event listener for tick speed slider
  let tickSpeedSlider = document.getElementById('tickSpeed');
  tickSpeedSlider.addEventListener('input', function() {
    tickSpeed = parseInt(this.value);
    document.getElementById('tickSpeedValue').innerText = this.value;
  });
}

function draw() {
  background(255);
  drawBacteria();
  moveBacteria();
  applyGravity();
  checkCollisions();
  ageBacteria();
  reproduceBacteria();
  checkFood();
}

function drawBacteria() {
  for (let bacterium of bacteria) {
    fill(bacterium.color);
    ellipse(
      bacterium.position.x,
      bacterium.position.y,
      bacterium.size,
      bacterium.size
    );
    for (let i = 0; i < bacterium.limbs; i++) {
      let angle = (TWO_PI / bacterium.limbs) * i;
      let x = bacterium.position.x + cos(angle) * bacterium.size;
      let y = bacterium.position.y + sin(angle) * bacterium.size;
      ellipse(x, y, bacterium.size / 2, bacterium.size / 2);
    }
  }
}

function moveBacteria() {
  for (let bacterium of bacteria) {
    let attractionForce = createVector(0, 0);
    let repulsionForce = createVector(0, 0);

    for (let other of bacteria) {
      if (bacterium !== other) {
        let distance = p5.Vector.dist(bacterium.position, other.position);
        let direction = p5.Vector.sub(other.position, bacterium.position);

        if (distance < 75) { // Increased repulsion distance
          // Repulsion force
          let repulsion = direction.copy().normalize().mult(-10 / distance); // Increased repulsion force
          repulsionForce.add(repulsion);
          bacterium.velocity.mult(1.5); // Rapidly speed up when too close
        } else if (distance < 200) {
          // Attraction force
          let attraction = direction.copy().normalize().mult(0.5 / distance); // Decreased attraction force
          attractionForce.add(attraction);
        }
      }
    }

    // Apply forces
    bacterium.velocity.add(attractionForce);
    bacterium.velocity.add(repulsionForce);
    bacterium.velocity.limit(bacterium.speed * tickSpeed); // Scale speed by tickSpeed

    bacterium.position.add(p5.Vector.mult(bacterium.velocity, tickSpeed)); // Scale movement by tickSpeed

    // Boundary conditions
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
    bacterium.position.y += gravity * tickSpeed; // Scale gravity by tickSpeed
    if (bacterium.position.y > height) {
      bacterium.position.y = height;
      bacterium.velocity.y *= -1;
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < bacteria.length; i++) {
    for (let j = i + 1; j < bacteria.length; j++) {
      let d = dist(
        bacteria[i].position.x,
        bacteria[i].position.y,
        bacteria[j].position.x,
        bacteria[j].position.y
      );
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
  let mutationType = random([
    "grow",
    "speed",
    "limb",
    "shrink",
    "slow",
    "color",
  ]);
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

function mutateDNA(dna) {
  let index = floor(random(dna.length));
  let newBase = random(dnaBases);
  return dna.substring(0, index) + newBase + dna.substring(index + 1);
}

function ageBacteria() {
  for (let bacterium of bacteria) {
    bacterium.age += 0.2 * tickSpeed; // Scale aging by tickSpeed
    bacterium.energy -= 0.1 * tickSpeed; // Scale energy consumption by tickSpeed
    if (bacterium.age > 500) {
      bacterium.size = max(5, bacterium.size - 0.1 * tickSpeed); // Scale size reduction by tickSpeed
    }
    // Remove death condition
    // if (bacterium.energy <= 0) {
    //   bacteria.splice(bacteria.indexOf(bacterium), 1);
    // }
  }
}

function checkFood() {
  for (let bacterium of bacteria) {
    for (let i = food.length - 1; i >= 0; i--) {
      let d = dist(
        bacterium.position.x,
        bacterium.position.y,
        food[i].x,
        food[i].y
      );
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
        energy: bacterium.energy / 2,
      };
      bacterium.energy /= 2;
      bacteria.push(newBacterium);
    }
  }
}
