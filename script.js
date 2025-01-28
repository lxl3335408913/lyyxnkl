class Firework {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.speed = 5 + Math.random() * 5;
        this.radius = 3;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.speed > 0.5) this.speed *= 0.95;
            
            if (Math.random() < 0.1) {
                this.explode();
            }
        } else {
            this.particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.alpha -= 0.02;
                if (p.alpha <= 0) this.particles.splice(i, 1);
            });
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            const angle = (Math.PI * 2) * (i / 100);
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: this.color
            });
        }
    }

    draw() {
        if (!this.exploded) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        } else {
            this.particles.forEach(p => {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${parseInt(p.color.slice(4, -1).split(',')[0])}, 
                    ${parseInt(p.color.slice(4, -1).split(',')[1])}, 
                    ${parseInt(p.color.slice(4, -1).split(',')[2])}, ${p.alpha})`;
                this.ctx.fill();
            });
        }
    }
}

// 初始化
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
let isMusicPlaying = false;
const audio = document.getElementById('bgm');
const blessingText = document.getElementById('blessing-text');
const blessings = [
    "愿2025的每一天都如烟花般绚烂！",
    "新年新气象，梦想成真！",
    "健康平安，万事胜意！",
    "事业蒸蒸日上，生活美满幸福！"
];

// 按钮功能
document.querySelector('.firework-btn').addEventListener('click', () => {
    fireworks.push(new Firework(canvas, ctx));
});

document.querySelector('.music-btn').addEventListener('click', () => {
    isMusicPlaying = !isMusicPlaying;
    isMusicPlaying ? audio.play() : audio.pause();
});

document.querySelector('.blessing-btn').addEventListener('click', () => {
    blessingText.textContent = blessings[Math.floor(Math.random() * blessings.length)];
    blessingText.style.animation = 'none';
    void blessingText.offsetWidth;
    blessingText.style.animation = 'fadeIn 1s';
});

// 动画循环
function animate() {
    ctx.fillStyle = 'rgba(10, 10, 46, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw();
        if (fw.particles.length === 0 && fw.exploded) fireworks.splice(i, 1);
    });
    
    requestAnimationFrame(animate);
}

animate();

// 窗口调整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});