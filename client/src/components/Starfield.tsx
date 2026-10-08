import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let startTime = 0;
    let stars: Star[] = [];

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = Math.max(55, Math.min(115, Math.floor((width * height) / 10500)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        radius: 0.35 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.5,
      }));
      draw(performance.now());
    };

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const y = (star.y * height + elapsed * star.speed) % height;
        const twinkle = motionPreference.matches
          ? 0.62
          : 0.32 + (Math.sin(elapsed * 0.75 + star.phase) + 1) * 0.23;
        context.beginPath();
        context.fillStyle = `rgba(220, 202, 255, ${twinkle})`;
        context.arc(star.x * width, y, star.radius, 0, Math.PI * 2);
        context.fill();
      }
      if (!motionPreference.matches && document.visibilityState === "visible") {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const resume = () => {
      window.cancelAnimationFrame(frame);
      if (document.visibilityState === "visible") {
        frame = window.requestAnimationFrame(draw);
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") window.cancelAnimationFrame(frame);
      else resume();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionPreference.addEventListener("change", resume);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionPreference.removeEventListener("change", resume);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
