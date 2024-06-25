const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const size = 4;
const cols = Math.floor(canvas.width / size) + 1;
const rows = Math.floor(canvas.height / size) + 1;

let grid = [];
for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
    }
}

let circles = [];
const num = 25;

// lavaLamp2.js

class Circle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.r = Math.random() * 30 + 20;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }

    move(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.r < 0 || this.x + this.r > canvasWidth) {
            this.vx *= -1;
        }
        if (this.y - this.r < 0 || this.y + this.r > canvasHeight) {
            this.vy *= -1;
        }

        this.checkBounds(canvasWidth, canvasHeight);
    }

    checkBounds(canvasWidth, canvasHeight) {
        if (this.x < this.r) this.x = this.r;
        if (this.x > canvasWidth - this.r) this.x = canvasWidth - this.r;
        if (this.y < this.r) this.y = this.r;
        if (this.y > canvasHeight - this.r) this.y = canvasHeight - this.r;
    }

    resolveCollision(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = this.r + other.r;

        if (distance < minDist) {
            const angle = Math.atan2(dy, dx);
            const targetX = this.x + Math.cos(angle) * minDist;
            const targetY = this.y + Math.sin(angle) * minDist;
            const ax = (targetX - other.x) * 0.05;
            const ay = (targetY - other.y) * 0.05;

            this.vx -= ax;
            this.vy -= ay;
            other.vx += ax;
            other.vy += ay;
        }
    }
}

function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const size = 6;
    const cols = Math.floor(canvas.width / size) + 1;
    const rows = Math.floor(canvas.height / size) + 1;

    let grid = [];
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0;
        }
    }

    let circles = [];
    const num = 25;

    for (let i = 0; i < num; i++) {
        circles.push(new Circle(canvas.width, canvas.height));
    }

    function updateGrid() {
        const introSection = document.querySelector('h1');
        const introSection2 = document.querySelector('p');
        const introSectionRect = introSection.getBoundingClientRect();
        const introSectionRect2 = introSection2.getBoundingClientRect();

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * size;
                const y = j * size;

                // if (
                //     (x + 150 > introSectionRect.left && x < introSectionRect.right + 170 && 
                //      y + 10 > introSectionRect.top && y < introSectionRect.bottom + 10) ||
                //     (x + 150 > introSectionRect2.left && x < introSectionRect2.right + 170 && 
                //      y > introSectionRect2.top + 100 && y < introSectionRect2.bottom)
                // ) {
                //     grid[i][j] = 0;
                //     continue;
                // }

                let val = 0;
                for (let k = 0; k < num; k++) {
                    const dx = x - circles[k].x;
                    const dy = y - circles[k].y;
                    val += (circles[k].r * circles[k].r) / (dx * dx + dy * dy);
                }
                grid[i][j] = val;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateGrid();

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const val = grid[i][j];

                if (val >= 1) {
                    ctx.fillStyle = 'lightgreen';
                    ctx.beginPath();
                    ctx.arc(i * size, j * size, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        for (let i = 0; i < num; i++) {
            circles[i].move(canvas.width, canvas.height);
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateGrid();
    });

    window.addEventListener('scroll', () => {
        canvas.style.top = `${window.scrollY}px`;
    });

    draw();
}

// Initialize both canvases
document.addEventListener('DOMContentLoaded', () => {
    initCanvas('canvas1');
    initCanvas('canvas2');
});
