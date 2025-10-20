// --- Personalization Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const name = urlParams.get("name");
  const nameElement = document.getElementById("name-display");

  if (name) {
    nameElement.textContent = `${decodeURIComponent(name)}!`; // Decode URL encoded names
  }
});

// --- Enhanced Fireworks Logic ---
const canvas = document.getElementById("fireworks-canvas");
if (!canvas) {
  console.error("Canvas element not found!");
  throw new Error("Canvas element not found!");
}
const ctx = canvas.getContext("2d");

let particles = [];
let explosions = [];
let fireworks = [];
let mouseX = 0;
let mouseY = 0;

// Adjust canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial resize

// Track mouse position for interactive fireworks
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function launchFirework(x, y) {
  // Launch from bottom center to clicked position
  let startX = canvas.width / 2;
  let startY = canvas.height;
  fireworks.push(new Firework(startX, startY, x, y));
}

// Enhanced Particle class for individual firework sparks
class Particle {
  constructor(x, y, color, speed, type = "normal") {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.type = type;
    this.angle = Math.random() * Math.PI * 2; // Random direction
    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };
    this.alpha = 1; // Transparency
    this.friction = 0.98; // Slow down over time
    this.gravity = 0.05; // Fall downwards
    this.size = Math.random() * 3 + 1; // Random size
    this.life = 1.0; // Life remaining
    this.maxLife = 1.0;

    // Enhanced properties for different particle types
    this.sparkle = Math.random() > 0.7; // Some particles sparkle
    this.trail = [];
    this.trailLength = 5;
    this.glowIntensity = Math.random() * 0.5 + 0.5;

    // Special effects
    this.pulse = Math.random() > 0.8; // Some particles pulse
    this.twinkle = Math.random() > 0.9; // Rare twinkling particles
  }

  update() {
    // Add to trail
    this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity; // Apply gravity

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.life -= 0.015; // Fade out
    this.alpha = this.life;

    // Special effects
    if (this.pulse) {
      this.size += Math.sin(Date.now() * 0.01) * 0.5;
    }
    if (this.twinkle) {
      this.alpha *= (Math.sin(Date.now() * 0.02) + 1) * 0.5;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Draw trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = this.alpha * 0.3;
      ctx.stroke();
    }

    // Draw main particle
    ctx.globalAlpha = this.alpha;

    // Create gradient for glow effect
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + "80");
    gradient.addColorStop(1, this.color + "00");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Add sparkle effect
    if (this.sparkle) {
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = this.alpha * 0.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Enhanced Firework class for the initial rocket and explosion
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
    this.trailLength = 8;
    this.speed = 3;
    this.angle = Math.atan2(endY - startY, endX - startX);
    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };
    this.brightness = Math.random() * 50 + 50; // For trail
    this.hue = Math.random() * 360; // Random color hue
    this.alpha = 1;
    this.size = 3;
    this.glowIntensity = 1;

    // Enhanced properties
    this.sparkle = true;
    this.pulse = true;
    this.explosionType = Math.random() > 0.5 ? "burst" : "spiral";
  }

  update(index) {
    this.trail.push({
      x: this.x,
      y: this.y,
      hue: this.hue,
      alpha: this.alpha,
      size: this.size,
    });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.distanceTraveled = Math.hypot(
      this.x - this.startX,
      this.y - this.startY
    );

    // Add pulsing effect
    if (this.pulse) {
      this.size = 3 + Math.sin(Date.now() * 0.01) * 1;
    }

    if (this.distanceTraveled >= this.distanceToEnd) {
      // Explode!
      this.createEnhancedExplosion(
        this.endX,
        this.endY,
        `hsl(${this.hue}, 100%, 50%)`
      );
      fireworks.splice(index, 1); // Remove this firework
    }
  }

  draw() {
    ctx.save();

    // Draw enhanced trail with glow
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const alpha = (i / this.trail.length) * this.alpha;

      // Create glow effect
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        point.size * 2
      );
      gradient.addColorStop(0, `hsla(${point.hue}, 100%, 70%, ${alpha})`);
      gradient.addColorStop(
        0.5,
        `hsla(${point.hue}, 100%, 50%, ${alpha * 0.5})`
      );
      gradient.addColorStop(1, `hsla(${point.hue}, 100%, 30%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw main rocket
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 2
    );
    gradient.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${this.alpha})`);
    gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 60%, ${this.alpha})`);
    gradient.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Add sparkle
    if (this.sparkle) {
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = this.alpha * 0.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  createEnhancedExplosion(x, y, color) {
    const particleCount = 120; // More particles for better effect

    for (let i = 0; i < particleCount; i++) {
      let speed, angle;

      if (this.explosionType === "spiral") {
        // Create spiral explosion
        angle = (i / particleCount) * Math.PI * 4 + Math.random() * 0.5;
        speed = Math.random() * 6 + 2;
      } else {
        // Create burst explosion
        angle = Math.random() * Math.PI * 2;
        speed = Math.random() * 8 + 1;
      }

      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      // Create particle with enhanced properties
      const particle = new Particle(x, y, color, speed);
      particle.velocity = velocity;
      particle.type = this.explosionType;

      // Add some variety to colors
      if (Math.random() > 0.7) {
        particle.color = `hsl(${
          (this.hue + Math.random() * 60 - 30) % 360
        }, 100%, 60%)`;
      }

      particles.push(particle);
    }

    // Create secondary explosion for extra effect
    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const particle = new Particle(x, y, color, speed);
        particle.velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        };
        particle.size = Math.random() * 2 + 0.5;
        particles.push(particle);
      }
    }, 200);
  }
}

let fireworkTimer = 0;
let fireworkInterval = 60; // How many frames between new fireworks

// Enhanced main animation loop
function animate() {
  requestAnimationFrame(animate);

  // Create dynamic background with stars
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0a0a2e"); // Deep blue
  gradient.addColorStop(0.5, "#16213e"); // Darker blue
  gradient.addColorStop(1, "#0f3460"); // Navy blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add twinkling stars
  drawStars();

  // Update and draw particles with enhanced effects
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0.1) {
      // Remove faded particles
      particles.splice(i, 1);
    }
  }

  // Performance optimization: limit total particles
  if (particles.length > 500) {
    particles.splice(0, particles.length - 500);
  }

  // Enhanced firework launching with more variety
  fireworkTimer++;
  if (fireworkTimer % fireworkInterval === 0) {
    // Launch fireworks from multiple positions
    const launchPositions = [
      { x: canvas.width * 0.2, y: canvas.height },
      { x: canvas.width * 0.5, y: canvas.height },
      { x: canvas.width * 0.8, y: canvas.height },
    ];

    const launchPos =
      launchPositions[Math.floor(Math.random() * launchPositions.length)];
    let endX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    let endY = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;

    fireworks.push(new Firework(launchPos.x, launchPos.y, endX, endY));
    fireworkInterval = Math.random() * 40 + 30; // Vary timing
  }

  // Update and draw fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update(i);
    fireworks[i].draw();
  }
}

// Function to draw twinkling stars
function drawStars() {
  ctx.save();
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 50; i++) {
    const x = (i * 137.5) % canvas.width;
    const y = (i * 89.3) % canvas.height;
    const alpha = (Math.sin(Date.now() * 0.001 + i) + 1) * 0.5;

    ctx.globalAlpha = alpha * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Initialize the application with both fireworks systems
function initApp() {
  try {
    console.log("🎆 Starting Diwali Fireworks Animation! 🎆");

    // Initialize jQuery fireworks plugin
    if (typeof $ !== "undefined" && $.fn.fireworks) {
      console.log("🎆 Initializing jQuery Fireworks Plugin...");

      // Create a dedicated container for jQuery fireworks
      const fireworksContainer = $("<div>")
        .attr("id", "jquery-fireworks-container")
        .css({
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: -2,
        })
        .appendTo("body");

      fireworksContainer.fireworks({
        sound: false, // Disable sound for better performance
        opacity: 0.9,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      console.log("✅ jQuery Fireworks Plugin initialized!");
    } else {
      console.warn(
        "⚠️ jQuery Fireworks Plugin not available, using custom fireworks only"
      );
    }

    // Check if canvas is properly initialized for custom fireworks
    if (!canvas || !ctx) {
      throw new Error("Canvas initialization failed");
    }

    // Start the custom animation
    animate();

    // Add keyboard shortcuts for testing
    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        // Launch firework at random position
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;

        // Launch custom firework
        launchFirework(x, y);

        // Also trigger jQuery fireworks if available
        if (typeof $ !== "undefined" && $.fn.fireworks) {
          const tempDiv = $("<div>")
            .css({
              position: "fixed",
              left: x - 100,
              top: y - 100,
              width: "200px",
              height: "200px",
              pointerEvents: "none",
              zIndex: -1,
            })
            .appendTo("body");

          tempDiv.fireworks({
            sound: false,
            opacity: 0.8,
            width: 200,
            height: 200,
          });

          // Remove temporary element after 15 seconds
          setTimeout(() => {
            if (tempDiv && tempDiv.length) {
              tempDiv.remove();
            }
          }, 15000);
        }
      }
    });

    // Add click handler for both systems
    document.addEventListener("click", (e) => {
      // Launch custom firework
      launchFirework(e.clientX, e.clientY);

      // Also trigger jQuery fireworks if available
      if (typeof $ !== "undefined" && $.fn.fireworks) {
        // Create a temporary element for jQuery fireworks
        const tempDiv = $("<div>")
          .css({
            position: "fixed",
            left: e.clientX - 100,
            top: e.clientY - 100,
            width: "200px",
            height: "200px",
            pointerEvents: "none",
            zIndex: -1,
          })
          .appendTo("body");

        tempDiv.fireworks({
          sound: false,
          opacity: 0.8,
          width: 200,
          height: 200,
        });

        // Remove temporary element after 15 seconds
        setTimeout(() => {
          if (tempDiv && tempDiv.length) {
            tempDiv.remove();
          }
        }, 15000);
      }
    });

    console.log("✅ Diwali Fireworks initialized successfully!");
    console.log("🎆 Dual fireworks system active!");
    console.log(
      "💡 Press SPACE to launch fireworks, click anywhere to launch!"
    );
    console.log("🔍 Debug: jQuery available:", typeof $ !== "undefined");
    console.log(
      "🔍 Debug: jQuery fireworks plugin:",
      typeof $ !== "undefined" && $.fn.fireworks
    );
    console.log("🔍 Debug: Canvas available:", !!canvas);
    console.log("🔍 Debug: Context available:", !!ctx);
  } catch (error) {
    console.error("❌ Error initializing fireworks:", error);
    // Show fallback message
    document.body.innerHTML +=
      '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; text-align: center; z-index: 9999;"><h2>🎆 Happy Diwali! 🎆</h2><p>Fireworks loading...</p></div>';
  }
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
