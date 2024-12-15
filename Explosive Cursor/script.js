// Nuclear explosion animation script
const canvas = document.getElementById("nuclearCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
        if (this.alpha > 0) this.draw();
    }
}

function createExplosion(x, y) {
    const colors = ["#ff4500", "#ffa500", "#ffd700", "#ffffff", "#ff6347"];
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
        };
        const radius = Math.random() * 5 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, radius, color, velocity));
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(particle => particle.update());

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Trigger an explosion in the center
canvas.addEventListener("click", (e) => {
    createExplosion(e.clientX, e.clientY);
});

// Initialize animation
animate();
