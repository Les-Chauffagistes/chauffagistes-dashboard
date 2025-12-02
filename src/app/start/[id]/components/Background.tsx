"use client";

import { useRef, useEffect } from "react";
import { createNoise2D } from "simplex-noise";

export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise2D = createNoise2D(); // noise2D(x, y) → [-1, 1]
    const W = 400;  // résolution interne
    const H = 250;

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const buffer = document.createElement("canvas");
    buffer.width = W;
    buffer.height = H;
    const bctx = buffer.getContext("2d")!;

    let t = 0;

    const palette = (v: number) => {
      // v ∈ [-1,1] → u ∈ [0,1]
      const u = (v + 1) * 0.5;

      // blend orange clair ↔ orange sombre ↔ jaune doux
      if (u < 0.5) {
        const k = u / 0.5;
        return lerpColor([255,180,90], [210,120,40], k);
      } else {
        const k = (u - 0.5) / 0.5;
        return lerpColor([210,120,40], [255,210,120], k);
      }
    };

    function lerpColor(a: number[], b: number[], t: number) {
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
      ];
    }

    const frame = () => {
      t += 0.004;

      const img = bctx.createImageData(W, H);
      const data = img.data;

      const scale = 0.9;
      const speed = 0.15;

      let p = 0;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x / W;
          const ny = y / H;

          const v = noise2D(nx * scale, ny * scale + t * speed);
          const [r, g, b] = palette(v);

          data[p++] = r;
          data[p++] = g;
          data[p++] = b;
          data[p++] = 255;
        }
      }

      bctx.putImageData(img, 0, 0);

      ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);

      requestAnimationFrame(frame);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    frame();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      id="bg"
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none"
      }}
    />
  );
}