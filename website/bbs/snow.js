/**
 * snow.js — Canvas snowfall with light flakes (for bright backgrounds)
 */
class SnowEngine {
  constructor(canvasId, opts = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.opts = Object.assign({ count: 90, color: '255,255,255', maxOpacity: 0.7 }, opts);
    this.flakes = [];
    this._resize();
    this._init();
    window.addEventListener('resize', () => { this._resize(); this._init(); });
    this._loop();
  }

  _resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;
  }

  _init() {
    this.flakes = Array.from({ length: this.opts.count }, () => this._make(true));
  }

  _make(randomY = false) {
    const r = Math.random() * 3 + 0.5;
    return {
      x: Math.random() * this.W,
      y: randomY ? Math.random() * this.H : -r * 2,
      r,
      vx: (Math.random() - 0.5) * 0.5,
      vy: r * 0.28 + 0.15,
      op: Math.random() * this.opts.maxOpacity * 0.6 + 0.15,
      w:  Math.random() * Math.PI * 2,
      ws: (Math.random() - 0.5) * 0.025,
      wa: Math.random() * 0.8 + 0.3,
    };
  }

  _loop() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);
    for (const f of this.flakes) {
      f.w  += f.ws;
      f.x  += f.vx + Math.sin(f.w) * f.wa * 0.25;
      f.y  += f.vy;
      if (f.y > this.H + 5) Object.assign(f, this._make(false));
      if (f.x < -5 || f.x > this.W + 5) f.x = Math.random() * this.W;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.opts.color},${f.op})`;
      ctx.shadowBlur = f.r * 3;
      ctx.shadowColor = `rgba(${this.opts.color},0.3)`;
      ctx.fill();
    }
    requestAnimationFrame(() => this._loop());
  }
}