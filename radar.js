// Hexagonal Radar Chart Engine for RPG Stat Visualization
// Canvas-rendered with glowing polygon vertices and animated stat interpolation

export class HexRadarChart {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.labels = options.labels || ['PHYSICAL', 'MENTAL', 'DISCIPLINE', 'SOCIAL', 'AMBITION', 'FOCUS'];
    this.keys = options.keys || ['physical', 'mental', 'discipline', 'social', 'ambition', 'focus'];
    this.themeColor = options.themeColor || '#F59E0B';
    this.currentValues = [60, 60, 60, 60, 60, 60];
    this.targetValues = [60, 60, 60, 60, 60, 60];
    this.animating = false;
    this.setupResolution();
  }

  setupResolution() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 320;
    const height = rect.height || 320;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.radius = Math.min(width, height) * 0.38;
  }

  setThemeColor(color) {
    this.themeColor = color || '#F59E0B';
    this.render();
  }

  updateStats(statsObj, animated = true) {
    this.targetValues = this.keys.map(k => Math.min(100, Math.max(10, statsObj[k] || 50)));
    if (!animated) {
      this.currentValues = [...this.targetValues];
      this.render();
      return;
    }
    this.animate();
  }

  animate() {
    if (this.animating) return;
    this.animating = true;

    const step = () => {
      let diff = 0;
      for (let i = 0; i < this.currentValues.length; i++) {
        const delta = this.targetValues[i] - this.currentValues[i];
        this.currentValues[i] += delta * 0.12;
        diff += Math.abs(delta);
      }

      this.render();

      if (diff > 0.5) {
        requestAnimationFrame(step);
      } else {
        this.currentValues = [...this.targetValues];
        this.render();
        this.animating = false;
      }
    };
    requestAnimationFrame(step);
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const numAxes = 6;
    const angleStep = (Math.PI * 2) / numAxes;
    const startAngle = -Math.PI / 2; // Point top

    // 1. Draw concentric background hexagon rings (20%, 40%, 60%, 80%, 100%)
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
    rings.forEach((ringPct, rIndex) => {
      this.ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = startAngle + i * angleStep;
        const x = this.centerX + Math.cos(angle) * (this.radius * ringPct);
        const y = this.centerY + Math.sin(angle) * (this.radius * ringPct);
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = rIndex === rings.length - 1 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      if (rIndex === rings.length - 1) {
        this.ctx.fillStyle = 'rgba(15, 17, 24, 0.6)';
        this.ctx.fill();
      }
    });

    // 2. Draw axis lines radiating from center
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const x = this.centerX + Math.cos(angle) * this.radius;
      const y = this.centerY + Math.sin(angle) * this.radius;

      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.stroke();
    }

    // 3. Draw Data Polygon
    this.ctx.beginPath();
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const valPct = this.currentValues[i] / 100;
      const x = this.centerX + Math.cos(angle) * (this.radius * valPct);
      const y = this.centerY + Math.sin(angle) * (this.radius * valPct);
      points.push({ x, y, val: Math.round(this.currentValues[i]) });
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();

    // Fill with gradient
    const grad = this.ctx.createRadialGradient(this.centerX, this.centerY, 10, this.centerX, this.centerY, this.radius);
    grad.addColorStop(0, this.hexToRgba(this.themeColor, 0.55));
    grad.addColorStop(1, this.hexToRgba(this.themeColor, 0.15));
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Glowing stroke
    this.ctx.strokeStyle = this.themeColor;
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = this.themeColor;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0; // reset

    // 4. Draw vertices (Dots)
    points.forEach((pt) => {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fill();
      this.ctx.strokeStyle = this.themeColor;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });

    // 5. Draw Labels & Values
    this.ctx.font = '700 11px system-ui, -apple-system, sans-serif';
    this.ctx.textBaseline = 'middle';

    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const labelDist = this.radius + 24;
      const x = this.centerX + Math.cos(angle) * labelDist;
      const y = this.centerY + Math.sin(angle) * labelDist;

      if (Math.abs(Math.cos(angle)) < 0.1) {
        this.ctx.textAlign = 'center';
      } else if (Math.cos(angle) > 0) {
        this.ctx.textAlign = 'left';
      } else {
        this.ctx.textAlign = 'right';
      }

      this.ctx.fillStyle = '#94A3B8';
      this.ctx.fillText(this.labels[i], x, y - 6);

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '800 12px system-ui, -apple-system, sans-serif';
      this.ctx.fillText(`${Math.round(this.currentValues[i])}`, x, y + 8);
      this.ctx.font = '700 11px system-ui, -apple-system, sans-serif';
    }
  }

  hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  }
}
