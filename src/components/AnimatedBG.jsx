import React, { useEffect, useRef } from 'react';

const AnimatedBG = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Particle Classes
    class EnergyParticle {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1.0;
        this.vy = (Math.random() - 0.5) * 1.5 - 0.5; // slow upward drift
        this.radius = Math.random() * 2.5 + 0.5;
        this.color = Math.random() > 0.5 ? 'rgba(0, 230, 118, 0.4)' : 'rgba(0, 176, 255, 0.4)';
        this.life = Math.random() * 100 + 100;
        this.maxLife = this.life;
      }

      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
          this.reset(w, h);
        }
      }

      draw(c) {
        const alpha = this.life / this.maxLife;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = 10;
        c.shadowColor = this.color.includes('230') ? '#00E676' : '#00B0FF';
        c.fill();
        c.shadowBlur = 0; // reset
      }
    }

    class ElectricGridNode {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pulse = Math.random() * Math.PI;
        this.speed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.pulse += this.speed;
      }

      draw(c) {
        const glow = Math.sin(this.pulse) * 8 + 10;
        c.beginPath();
        c.arc(this.x, this.y, 4, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0, 229, 255, 0.8)';
        c.shadowBlur = glow;
        c.shadowColor = '#00E5FF';
        c.fill();
        c.shadowBlur = 0;
      }
    }

    // Set up nodes
    const nodes = [];
    const particles = Array.from({ length: 45 }, () => new EnergyParticle(canvas.width, canvas.height));
    
    // Create fixed charging grid nodes on sides
    const nodeCount = 5;
    for (let i = 0; i <= nodeCount; i++) {
      const y = (canvas.height / nodeCount) * i;
      nodes.push(new ElectricGridNode(20, y + 20));
      nodes.push(new ElectricGridNode(canvas.width - 20, y + 20));
    }

    // Lightning pulse control
    let lightningTimer = 0;
    let lightningStrike = null;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 28, 0.08)'; // trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid System lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw energy flow line
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.bezierCurveTo(
        canvas.width * 0.35, canvas.height * 0.5,
        canvas.width * 0.65, canvas.height * 0.9,
        canvas.width, canvas.height * 0.7
      );
      ctx.stroke();

      // Update and draw particles
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });

      // Update and draw nodes
      nodes.forEach((n) => {
        n.update();
        n.draw(ctx);
      });

      // Periodic Lightning strike
      lightningTimer++;
      if (lightningTimer > 180) { // every 3 seconds approx
        if (Math.random() > 0.4) {
          const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
          const toNode = nodes[Math.floor(Math.random() * nodes.length)];
          if (fromNode !== toNode && Math.abs(fromNode.x - toNode.x) < canvas.width * 0.4) {
            lightningStrike = { from: fromNode, to: toNode, life: 12 };
          }
        }
        lightningTimer = 0;
      }

      if (lightningStrike) {
        ctx.beginPath();
        ctx.moveTo(lightningStrike.from.x, lightningStrike.from.y);
        
        // Jagged line path
        const segments = 4;
        let currX = lightningStrike.from.x;
        let currY = lightningStrike.from.y;
        const dx = (lightningStrike.to.x - lightningStrike.from.x) / segments;
        const dy = (lightningStrike.to.y - lightningStrike.from.y) / segments;

        for (let i = 1; i < segments; i++) {
          const offset = (Math.random() - 0.5) * 45;
          currX += dx + offset;
          currY += dy + offset;
          ctx.lineTo(currX, currY);
        }
        ctx.lineTo(lightningStrike.to.x, lightningStrike.to.y);
        
        ctx.strokeStyle = Math.random() > 0.5 ? '#00E676' : '#00E5FF';
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();
        ctx.shadowBlur = 0;

        lightningStrike.life--;
        if (lightningStrike.life <= 0) lightningStrike = null;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#0A0F1C]"
    />
  );
};

export default AnimatedBG;
