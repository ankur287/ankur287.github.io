/**
 * gondola.js
 * Physically accurate gondola + cable animation.
 * Cars hang vertically from a grip point that travels along a tilted cable.
 * Cable is defined by two anchor points (% of container).
 */

class CableSystem {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.opts = Object.assign({
      // Cable anchors as % of container width/height
      ax: 0,    ay: 68,   // left anchor
      bx: 100,  by: 32,   // right anchor (higher = going uphill right)
      numCars:  4,
      carW:     80,
      carH:     60,
      hangerH:  22,
      speed:    0.000055, // progress units per ms
      cableColor: 'rgba(30,30,30,0.65)',
      cableThickness: 2,
    }, options);

    this.cars = [];
    this.rafId = null;
    this.lastTs = null;
    this._W = 0;
    this._H = 0;

    // Pixel anchor cache
    this._ax = 0; this._ay = 0;
    this._bx = 0; this._by = 0;

    this._build();
    this._handleResize();
    window.addEventListener('resize', () => this._handleResize());
    this.rafId = requestAnimationFrame(ts => this._tick(ts));
  }

  _build() {
    // Cable line element
    this.cableEl = document.createElement('div');
    this.cableEl.style.cssText = `
      position:absolute; pointer-events:none; z-index:4;
      transform-origin: left center;
    `;
    this.container.appendChild(this.cableEl);

    // Cars — spaced evenly across the cable
    const spacing = 1 / this.opts.numCars;
    for (let i = 0; i < this.opts.numCars; i++) {
      const t = -i * spacing; // start staggered, some off-screen
      const car = this._buildCar();
      this.container.appendChild(car);
      this.cars.push({ el: car, t });
    }
  }

  _buildCar() {
    const { carW, carH, hangerH } = this.opts;
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute; pointer-events:none; z-index:5;
      width:${carW}px;
      transition: opacity 0.3s;
    `;
    el.innerHTML = this._carSVG();
    return el;
  }

  _carSVG() {
    const { carW: W, carH: H, hangerH: HH } = this.opts;
    const total = H + HH;
    // Grip wheel radius
    const gr = 6;
    // Window dimensions
    const wW = (W - 20) / 2 - 2;
    const wH = H - 18;
    const wY = HH + 8;

    return `<svg width="${W}" height="${total}" viewBox="0 0 ${W} ${total}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Grip on cable -->
      <rect x="${W/2 - 2.5}" y="0" width="5" height="${HH - gr}" fill="#444" rx="2"/>
      <circle cx="${W/2}" cy="${gr}" r="${gr}" fill="#2c2c2c"/>
      <circle cx="${W/2}" cy="${gr}" r="3" fill="#555"/>

      <!-- Car body -->
      <rect x="3" y="${HH}" width="${W-6}" height="${H}" rx="6" fill="#be3a2a" stroke="#922b21" stroke-width="1.5"/>

      <!-- Roof panel -->
      <rect x="3" y="${HH}" width="${W-6}" height="7" rx="6" fill="#a53224"/>
      <rect x="3" y="${HH+3}" width="${W-6}" height="4" fill="#a53224"/>

      <!-- Left window -->
      <rect x="8" y="${wY}" width="${wW}" height="${wH}" rx="3"
        fill="rgba(195,225,245,0.5)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
      <!-- Window glare -->
      <rect x="10" y="${wY+2}" width="4" height="${wH-4}" rx="2" fill="rgba(255,255,255,0.3)"/>

      <!-- Right window -->
      <rect x="${8 + wW + 4}" y="${wY}" width="${wW}" height="${wH}" rx="3"
        fill="rgba(195,225,245,0.5)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
      <rect x="${8 + wW + 6}" y="${wY+2}" width="4" height="${wH-4}" rx="2" fill="rgba(255,255,255,0.3)"/>

      <!-- Bottom trim -->
      <rect x="3" y="${HH + H - 7}" width="${W-6}" height="7" rx="0 0 6 6" fill="#7b1d10"/>

      <!-- Side stripe -->
      <rect x="3" y="${HH + H/2 - 2}" width="${W-6}" height="3" fill="rgba(255,255,255,0.15)"/>
    </svg>`;
  }

  _handleResize() {
    const r = this.container.getBoundingClientRect();
    this._W = r.width;
    this._H = r.height;
    this._updateAnchors();
    this._drawCable();
  }

  _updateAnchors() {
    this._ax = this.opts.ax / 100 * this._W;
    this._ay = this.opts.ay / 100 * this._H;
    this._bx = this.opts.bx / 100 * this._W;
    this._by = this.opts.by / 100 * this._H;
  }

  _drawCable() {
    const dx = this._bx - this._ax;
    const dy = this._by - this._ay;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    this.cableEl.style.cssText = `
      position:absolute; pointer-events:none; z-index:4;
      left:${this._ax}px; top:${this._ay}px;
      width:${len}px; height:${this.opts.cableThickness}px;
      background:${this.opts.cableColor};
      transform:rotate(${angle}deg);
      transform-origin:left center;
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    `;
  }

  _tick(ts) {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min(ts - this.lastTs, 50); // cap at 50ms to prevent jump on tab restore
    this.lastTs = ts;

    for (const car of this.cars) {
      car.t += this.opts.speed * dt;

      // Wrap — start slightly off left edge, end slightly off right
      if (car.t > 1.12) car.t = -0.12;

      // Interpolate attachment point along cable
      const attachX = this._ax + car.t * (this._bx - this._ax);
      const attachY = this._ay + car.t * (this._by - this._ay);

      // Car hangs from attachment point (SVG top = grip = cable contact)
      car.el.style.left = `${attachX - this.opts.carW / 2}px`;
      car.el.style.top  = `${attachY}px`;
      car.el.style.opacity = (car.t >= 0 && car.t <= 1) ? '1' : '0';
    }

    this.rafId = requestAnimationFrame(ts => this._tick(ts));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', () => this._handleResize());
  }
}
