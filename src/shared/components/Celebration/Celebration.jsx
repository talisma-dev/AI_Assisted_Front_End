import React, { useEffect, useRef, useState } from 'react';
import './Celebration.css';

const COLORS = [
  '#FF4B4B', '#FF9800', '#FFEB3B', '#4CAF50', '#29B6F6',
  '#9C27B0', '#E91E63', '#00BCD4', '#8BC34A', '#FF5722'
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

class Piece {
  constructor(canvasWidth) {
    this.x = randomBetween(0, canvasWidth);
    this.y = randomBetween(0, 100);
    this.w = randomBetween(6, 14);
    this.h = randomBetween(14, 28);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rotation = randomBetween(0, Math.PI * 2);
    this.rotSpeed = randomBetween(-0.08, 0.08);
    this.speedX = randomBetween(-1.2, 1.2);
    this.speedY = randomBetween(2.5, 5.5);
    this.isRibbon = Math.random() < 0.25;
    this.waveAmp = randomBetween(0.3, 0.9);
    this.waveFreq = randomBetween(0.04, 0.09);
    this.tick = randomBetween(0, 100);
    this.opacity = 1;
  }

  update(canvasHeight) {
    this.tick++;
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.tick * this.waveFreq) * this.waveAmp;
    this.rotation += this.rotSpeed;
    if (this.y > canvasHeight - 60) {
      this.opacity = Math.max(0, this.opacity - 0.04);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;

    if (this.isRibbon) {
      ctx.beginPath();
      ctx.moveTo(0, -this.h / 2);
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const px = Math.sin(t * Math.PI * 2) * this.w * 0.5;
        const py = -this.h / 2 + t * this.h;
        ctx.lineTo(px, py);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }

    ctx.restore();
  }
}

const Celebration = ({ trigger }) => {
  const canvasRef = useRef(null);
  const piecesRef = useRef([]);
  const rafRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const spawnBurst = (canvasWidth) => {
    for (let i = 0; i < 120; i++) {
      piecesRef.current.push(new Piece(canvasWidth));
    }
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    piecesRef.current = piecesRef.current.filter(
      (p) => p.opacity > 0 && p.y < canvas.height + 40
    );

    piecesRef.current.forEach((p) => {
      p.update(canvas.height);
      p.draw(ctx);
    });

    if (piecesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      rafRef.current = null;
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (!trigger) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      piecesRef.current = [];
      setIsActive(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    setIsActive(true);
    piecesRef.current = [];
    spawnBurst(canvas.width);

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [trigger]);
  return (
    <div className={`celebration-overlay ${isActive ? 'celebration-visible' : ''}`}>
      <canvas ref={canvasRef} className="celebration-canvas" />
    </div>
  );
};

export default Celebration;



