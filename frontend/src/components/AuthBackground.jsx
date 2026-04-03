import React, { useEffect, useRef } from 'react';

// Floating social/app related characters and icons
const CHARS = [
  '❤️', '💬', '🌐', '✨', '🔥', '💡', '🎯', '🚀', '⭐', '💫',
  '📸', '🎨', '🌟', '💎', '🎉', '👥', '📱', '🌈', '⚡', '🎭',
  '#', '@', '♥', '✦', '◈', '❋', '✿', '⬡', '◉', '✺',
  'S', 'O', 'C', 'I', 'A', 'L',
];

const COLORS = [
  'rgba(29,106,255,0.7)',
  'rgba(99,179,255,0.6)',
  'rgba(139,92,246,0.6)',
  'rgba(236,72,153,0.5)',
  'rgba(16,185,129,0.5)',
  'rgba(245,158,11,0.5)',
];

export default function AuthBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const count = Math.min(38, Math.floor(window.innerWidth / 30));
    particlesRef.current = Array.from({ length: count }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      char:    CHARS[Math.floor(Math.random() * CHARS.length)],
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      size:    12 + Math.random() * 22,
      speedX:  (Math.random() - 0.5) * 0.5,
      speedY:  -(0.3 + Math.random() * 0.6),
      opacity: 0.15 + Math.random() * 0.55,
      rotate:  Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 0.8,
      wobble:  Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotate * Math.PI) / 180);
        ctx.fillText(p.char, 0, 0);
        ctx.restore();

        // Move
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.4;
        p.y += p.speedY;
        p.rotate += p.rotateSpeed;

        // Reset when off screen
        if (p.y < -40) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -40) p.x = canvas.width + 20;
        if (p.x > canvas.width + 40) p.x = -20;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
