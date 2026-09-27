import * as THREE from "three";

/**
 * Procedural textures drawn on canvases, so the scenes need no image downloads.
 * Each is created once and cached.
 */
const cache = new Map<string, THREE.Texture>();

function canvasTexture(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, t);
  return t;
}

/** Heat-exchanger fins: tight vertical lines with a slight sheen. */
export const finTexture = () =>
  canvasTexture("fins", 256, 64, (ctx) => {
    ctx.fillStyle = "#8d99a5";
    ctx.fillRect(0, 0, 256, 64);
    for (let x = 0; x < 256; x += 4) {
      ctx.fillStyle = "#c9d3dc";
      ctx.fillRect(x, 0, 1, 64);
      ctx.fillStyle = "#56616d";
      ctx.fillRect(x + 2, 0, 1, 64);
    }
    // copper tube passes
    for (let y = 6; y < 64; y += 16) {
      ctx.fillStyle = "rgba(178,110,60,0.55)";
      ctx.fillRect(0, y, 256, 3);
    }
  });

/** Corrugated cladding (cooling tower casing, enclosures). Used as colour and bump map. */
export const corrugatedTexture = () =>
  canvasTexture(
    "corrugated",
    64,
    256,
    (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 64, 0);
      g.addColorStop(0, "#6f6f6f");
      g.addColorStop(0.5, "#f2f2f2");
      g.addColorStop(1, "#6f6f6f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 256);
    },
    false,
  );

/** Mottled concrete for slabs and basins. */
export const concreteTexture = () =>
  canvasTexture("concrete", 512, 512, (ctx) => {
    ctx.fillStyle = "#7c8187";
    ctx.fillRect(0, 0, 512, 512);
    let s = 1;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 9000; i++) {
      const v = 95 + r() * 60;
      ctx.fillStyle = `rgba(${v},${v + 3},${v + 7},${0.08 + r() * 0.12})`;
      ctx.fillRect(r() * 512, r() * 512, 1 + r() * 3, 1 + r() * 3);
    }
    ctx.strokeStyle = "rgba(40,44,50,0.35)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
  });

/** Radial alpha falloff so the ground disc melts into the page background. */
export const radialFade = () =>
  canvasTexture(
    "fade",
    256,
    256,
    (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
      g.addColorStop(0, "#fff");
      g.addColorStop(0.55, "#bbb");
      g.addColorStop(1, "#000");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    },
    false,
  );

/** Soft round sprite for vapour, mist and air particles. */
export const softDot = () =>
  canvasTexture("dot", 64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });

/** Dashes that slide along a pipe to show flow direction. */
export const flowStripes = () =>
  canvasTexture("stripes", 128, 8, (ctx) => {
    ctx.clearRect(0, 0, 128, 8);
    const g = ctx.createLinearGradient(0, 0, 128, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.6, "rgba(255,255,255,0.9)");
    g.addColorStop(0.75, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 8);
  });

/** Louvre slats for air inlets. */
export const louvreTexture = () =>
  canvasTexture("louvre", 64, 64, (ctx) => {
    ctx.fillStyle = "#1a1f26";
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 8) {
      const g = ctx.createLinearGradient(0, y, 0, y + 8);
      g.addColorStop(0, "#9aa3ad");
      g.addColorStop(0.6, "#4a525c");
      g.addColorStop(1, "#15191e");
      ctx.fillStyle = g;
      ctx.fillRect(0, y, 64, 6);
    }
  });

/** Brushed/galvanised steel streaks. */
export const brushedTexture = () =>
  canvasTexture("brushed", 256, 256, (ctx) => {
    ctx.fillStyle = "#9aa4ae";
    ctx.fillRect(0, 0, 256, 256);
    let s = 7;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 1400; i++) {
      const v = 120 + r() * 90;
      ctx.fillStyle = `rgba(${v},${v + 4},${v + 8},0.25)`;
      ctx.fillRect(r() * 256, r() * 256, 40 + r() * 120, 1);
    }
  });
