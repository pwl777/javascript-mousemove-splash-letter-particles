/* ------ JavaScript - Mousemove Splash Letters ------ */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.textBaseline = "middle";
let lettersArray = ["P", "i", "e", "r", "s", "o", "n"];
let hue = 0;
let particles = [];
let numberOfParticles = (canvas.width * canvas.height) / 7000;
// let numberOfParticles = 20;

const mouse = {
  x: 0,
  y: 0,
  radius: 60,
  autopilotAngle: 0,
};

window.addEventListener("mousemove", function (e) {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "hsl(" + hue + ", 100%, 50%)";
    this.text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
  }
  draw() {
    // Main particle body.
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // 5 Arguments, positions x and y, particle radius, starting angle and ending angle.
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
    // White highlight on main particle body.
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 1.5, true); // Anti-clockwise set to true, inverting the area to produce highlight effect.
    ctx.fillStyle = "white";
    ctx.fill();
    // White Letters on main particle body.
    ctx.font = this.radius + "px Fredoka One"; // Verdana
    ctx.fillText(this.text, this.x - this.radius / 2.7, this.y);
  }
  update() {
    if (mouse.x === undefined && mouse.y === undefined) {
      let newX =
        ((mouse.radius * canvas.width) / 200) *
        Math.sin(mouse.autopilotAngle * (Math.PI / 180)); // Try swapping sin and cos around, to get a different movement.
      let newY =
        ((mouse.radius * canvas.width) / 200) *
        Math.cos(mouse.autopilotAngle * (Math.PI / 360)); // Try swapping sin and cos around, to get a different movement.
      mouse.x = newX + canvas.width / 2; // This will center the mouse X position, so it's not stuck in the top screen right corner.
      mouse.y = newY + canvas.height / 2; // This will center the mouse Y position, so it's not stuck in the top screen right corner.
    }
    mouse.autopilotAngle += 0.0075; // This value controls the speed of this effect, during it's autopilot phase.
  }
}

function handleOverlap() {
  let overlapping = false;
  let protection = 500;
  let counter = 0;

  while (particles.length < numberOfParticles && counter < protection) {
    let randomAngle = Math.random() * 2 * Math.PI;
    let randomRadius = mouse.radius * Math.sqrt(Math.random());
    let particle = {
      x: mouse.x + randomRadius * Math.cos(randomAngle),
      y: mouse.y + randomRadius * Math.sin(randomAngle),
      radius: Math.floor(Math.random() * 30) + 10,
    };
    overlapping = false;
    for (let i = 0; i < particles.length; i++) {
      let previousParticle = particles[i];
      let dx = particle.x - previousParticle.x;
      let dy = particle.y - previousParticle.y;
      let distance = Math.sqrt(dx * dx + dy * dy); // Circle Collision - Pythagorus theorum.
      if (distance < particle.radius + previousParticle.radius) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      particles.unshift(new Particle(particle.x, particle.y, particle.radius));
    }
    counter++;
  }
}
handleOverlap();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();
  }
  if (particles.length >= numberOfParticles) {
    for (let i = 0; i < 5; i++) {
      particles.pop();
    }
  }
  handleOverlap();
  hue += 2; // This value adjusts the speed the cycling colours.
  requestAnimationFrame(animate);
}
animate();

let autopilot = setInterval(function () {
  mouse.x = undefined;
  mouse.y = undefined;
}, 40); // 40 milli seconds.

canvas.addEventListener("mouseleave", function () {
  autopilot = setInterval(function () {
    mouse.x = undefined;
    mouse.y = undefined;
  }, 40);
});

canvas.addEventListener("mouseenter", function () {
  clearInterval(autopilot);
  autopilot = undefined;
});
