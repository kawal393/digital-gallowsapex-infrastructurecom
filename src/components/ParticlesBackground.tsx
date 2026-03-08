import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  drift: number;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
      }));
    };

    let lastTime = 0;
    const interval = 1000 / 30;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -10) {
          p.y = window.innerHeight + 10;
          p.x = Math.random() * window.innerWidth;
        }
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Adapt particle color for light/dark mode
        const isLight = document.documentElement.classList.contains("light");
        ctx.fillStyle = isLight
          ? `hsla(38, 70%, 35%, ${p.opacity})`
          : `hsla(43, 85%, 52%, ${p.opacity})`;
        ctx.fill();
      }
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    resizeCanvas();
    createParticles();
    animId = requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
};

export default ParticlesBackground;
