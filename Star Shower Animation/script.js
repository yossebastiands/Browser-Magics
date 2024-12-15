const canvas = document.getElementById("cosmicCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let meteors = [];

class Star {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = Math.random();
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
        this.alpha -= 0.005;

        if (this.alpha <= 0) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.alpha = Math.random();
        }

        this.draw();
    }
}

class Meteor {
    constructor(x, y, velocity, lifetime) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.opacity = 0; // Start invisible
        this.isFadingIn = true;
        this.age = 0;
        this.lifetime = lifetime || Math.random() * 200 + 100; // Increased minimum lifetime
        this.trail = []; // Store trail positions
        this.color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`; // Random color
        this.size = Math.random() * 4 + 2; // Randomized size between 2 and 6
    }

    draw() {
        // Draw trail
        this.trail.forEach((pos, index) => {
            ctx.save();
            ctx.globalAlpha = (index + 1) / this.trail.length * this.opacity;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        });

        // Draw meteor
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.isFadingIn) {
            this.opacity += 0.02;
            if (this.opacity >= 1) {
                this.isFadingIn = false;
            }
        } else {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.opacity -= 0.005;
        }

        this.age++;

        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 20) {
            this.trail.shift();
        }

        if (this.age >= this.lifetime || this.opacity <= 0) {
            this.respawn();
        }

        this.draw();
    }

    respawn() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.5;
        this.velocity = {
            x: Math.random() * -2 - 2,
            y: Math.random() * 2 + 1
        };
        this.opacity = 0; // Start invisible again
        this.isFadingIn = true;
        this.age = 0;
        this.lifetime = Math.random() * 200 + 100; // New random lifetime with increased minimum
        this.trail = []; // Reset trail
        this.color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`; // New random color
        this.size = Math.random() * 4 + 2; // New randomized size
    }
}

function generateStars(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        const color = `rgba(255, 255, 255, ${Math.random()})`;
        const velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
        };

        stars.push(new Star(x, y, radius, color, velocity));
    }
}

function generateMeteors(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        const velocity = {
            x: Math.random() * -2 - 2,
            y: Math.random() * 2 + 1
        };
        const lifetime = Math.random() * 200 + 100; // Increased minimum lifetime

        meteors.push(new Meteor(x, y, velocity, lifetime));
    }
}

function drawWatermark() {
    ctx.save();
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "right";
    ctx.fillText("Star-Shower by Yos Sebastian", canvas.width - 10, canvas.height - 10);
    ctx.restore();
}

function animate() {
    ctx.fillStyle = "rgba(2, 2, 44, 1)"; // Fully cover with sky color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => star.update());
    meteors.forEach(meteor => meteor.update());

    drawWatermark();

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    meteors = [];
    generateStars(400);
    generateMeteors(10);
});

// Initialize
generateStars(400);
generateMeteors(10);
animate();
