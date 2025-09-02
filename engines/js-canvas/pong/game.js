const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;
const PADDLE_H = 64, PADDLE_W = 10;
const BALL_SIZE = 8;

let keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup",   e => keys[e.key] = false);

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

class Paddle {
  constructor(x) { this.x = x; this.y = (H - PADDLE_H)/2; this.score = 0; }
  update(dt, ai=false, ball=null) {
    if (!ai) {
      const speed = 220;
      if (keys["ArrowUp"])   this.y -= speed * dt;
      if (keys["ArrowDown"]) this.y += speed * dt;
    } else {
      // simple AI: chase ball with a modest delay
      const speed = 190;
      const target = ball.y - PADDLE_H/2;
      this.y += Math.sign(target - this.y) * speed * dt;
    }
    this.y = clamp(this.y, 0, H - PADDLE_H);
  }
  draw() {
    ctx.fillRect(this.x, this.y, PADDLE_W, PADDLE_H);
  }
}

class Ball {
  constructor() { this.reset(); }
  reset(dir = Math.random() < 0.5 ? -1 : 1) {
    this.x = W/2; this.y = H/2;
    const speed = 220;
    const angle = (Math.random()*0.8 - 0.4); // slight vertical
    this.vx = dir * speed * Math.cos(angle);
    this.vy = speed * Math.sin(angle);
  }
  update(dt, left, right) {
    this.x += this.vx * dt; this.y += this.vy * dt;

    // top/bottom
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    if (this.y > H - BALL_SIZE) { this.y = H - BALL_SIZE; this.vy *= -1; }

    // paddle collisions
    if (this.vx < 0 && this.x <= left.x + PADDLE_W &&
        this.y + BALL_SIZE >= left.y && this.y <= left.y + PADDLE_H) {
      this.x = left.x + PADDLE_W;
      const rel = (this.y + BALL_SIZE/2) - (left.y + PADDLE_H/2);
      this.vx = Math.abs(this.vx) * 1.05; // speed up
      this.vy = rel * 5;
    }

    if (this.vx > 0 && this.x + BALL_SIZE >= right.x &&
        this.y + BALL_SIZE >= right.y && this.y <= right.y + PADDLE_H) {
      this.x = right.x - BALL_SIZE;
      const rel = (this.y + BALL_SIZE/2) - (right.y + PADDLE_H/2);
      this.vx = -Math.abs(this.vx) * 1.05;
      this.vy = rel * 5;
    }

    // scoring
    if (this.x < -BALL_SIZE) { right.score++; this.reset(1); }
    if (this.x > W + BALL_SIZE) { left.score++; this.reset(-1); }
  }
  draw() { ctx.fillRect(this.x, this.y, BALL_SIZE, BALL_SIZE); }
}

const left = new Paddle(20);
const right = new Paddle(W - 20 - PADDLE_W);
const ball = new Ball();

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000; last = now;

  if (keys["r"] || keys["R"]) { left.score = right.score = 0; ball.reset(); }

  left.update(dt, false, ball);
  right.update(dt, true, ball);
  ball.update(dt, left, right);

  // draw
  ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = "#0f0";
  // center dashed line
  for (let y=0; y<H; y+=20) ctx.fillRect(W/2-1, y, 2, 10);
  left.draw(); right.draw(); ball.draw();

  // score
  ctx.fillStyle = "#fff";
  ctx.font = "16px monospace";
  ctx.fillText(left.score.toString().padStart(2,"0"), W*0.25, 24);
  ctx.fillText(right.score.toString().padStart(2,"0"), W*0.75, 24);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
