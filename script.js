// --- Personalization Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const name = urlParams.get('name');
    const nameElement = document.getElementById('name-display');
    
    if (name) {
        nameElement.textContent = `${decodeURIComponent(name)}!`; // Decode URL encoded names
    }
});


// --- Fireworks Logic ---
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let explosions = [];

// Adjust canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize

// Particle class for individual firework sparks
class Particle {
    constructor(x, y, color, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2; // Random direction
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.alpha = 1; // Transparency
        this.friction = 0.98; // Slow down over time
        this.gravity = 0.05; // Fall downwards
        this.size = Math.random() * 2 + 1; // Random size
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity; // Apply gravity

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015; // Fade out
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Firework class for the initial rocket and explosion
class Firework {
    constructor(startX, startY, endX, endY) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.distanceToEnd = Math.hypot(endX - startX, endY - startY);
        this.distanceTraveled = 0;
        this.trail = [];
        this.trailLength = 4;
        this.speed = 2;
        this.angle = Math.atan2(endY - startY, endX - startX);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.brightness = Math.random() * 50 + 50; // For trail
        this.hue = Math.random() * 360; // Random color hue
        this.alpha = 1;
    }

    update(index) {
        this.trail.push({ x: this.x, y: this.y, hue: this.hue, alpha: this.alpha });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.distanceTraveled = Math.hypot(this.x - this.startX, this.y - this.startY);

        if (this.distanceTraveled >= this.distanceToEnd) {
            // Explode!
            this.createParticles(this.endX, this.endY, `hsl(${this.hue}, 100%, 50%)`);
            fireworks.splice(index, 1); // Remove this firework
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 0; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    createParticles(x, y, color) {
        // Create a burst of particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle(x, y, color, Math.random() * 5 + 1));
        }
    }
}

let fireworks = [];
let fireworkTimer = 0;
let fireworkInterval = 60; // How many frames between new fireworks

// Main animation loop
function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear only what needs to be cleared
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1d0336'); // Deep purple
    gradient.addColorStop(1, '#4a171d'); // Dark red
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0.1) { // Remove faded particles
            particles.splice(i, 1);
        }
    }

    // Update and draw fireworks
    fireworkTimer++;
    if (fireworkTimer % fireworkInterval === 0) {
        // Launch a new firework from the bottom center to a random top spot
        let startX = canvas.width / 2;
        let startY = canvas.height;
        let endX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1; // Random X in upper 80%
        let endY = Math.random() * canvas.height * 0.4 + canvas.height * 0.1; // Random Y in upper 40%
        fireworks.push(new Firework(startX, startY, endX, endY));
        fireworkInterval = Math.random() * 30 + 40; // Vary next firework timing
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update(i);
        fireworks[i].draw();
    }
}

animate(); // Start the animation