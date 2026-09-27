/**
 * The iridescent "liquid": domain-warped fbm read as a temperature field and mapped through a hot-to-cold ramp
 * (oxblood → orange → amber → yellow → sage → blue) with a thin sheen. Shared by the hero backdrop and the
 * liquid-filled key figures so both show exactly the same material.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// The precision line is chosen at runtime: highp where the GPU supports it in fragment shaders. Laptop and mobile GPUs
// that honour mediump as 16-bit float otherwise turn the noise blocky.
const FRAG = `
uniform vec2 u_res;
uniform float u_time;
uniform float u_ink;      // how far the darkest folds sink towards black (1 = hero, lower keeps figures colourful)
uniform float u_vignette; // edge darkening (hero only)
// Sine-free hash: stable at any float precision (Dave Hoskins, "Hash without Sine").
float hash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
// Hot (1) to cold (0).
vec3 ramp(float h){
  vec3 blue = vec3(0.157, 0.353, 0.690);
  vec3 sage = vec3(0.627, 0.878, 0.671);
  vec3 yellow = vec3(1.0, 0.843, 0.400);
  vec3 amber = vec3(1.0, 0.674, 0.180);
  vec3 orange = vec3(0.925, 0.400, 0.157);
  vec3 ox = vec3(0.647, 0.176, 0.145);
  vec3 c = blue;
  c = mix(c, sage, smoothstep(0.14, 0.34, h));
  c = mix(c, yellow, smoothstep(0.34, 0.47, h));
  c = mix(c, amber, smoothstep(0.47, 0.57, h));
  c = mix(c, orange, smoothstep(0.57, 0.70, h));
  c = mix(c, ox, smoothstep(0.70, 0.86, h));
  return c;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 5.2));
  vec2 r = vec2(fbm(p * 1.5 + 3.0 * q + vec2(1.7, 9.2) + 0.6 * t), fbm(p * 1.5 + 3.0 * q + vec2(8.3, 2.8) - 0.5 * t));
  float f = fbm(p * 1.1 + 3.2 * r);

  // Temperature: the warped field sets the fine structure, a slow large-scale term keeps whole regions hot or cold.
  float h = clamp(0.47 + (f - 0.5) * 1.4 + (q.x - q.y) * 0.5 + (r.y - 0.5) * 0.35, 0.0, 1.0);
  vec3 col = ramp(h);
  // Tonal relief from the fine structure, so no hue ever sits as a flat slab.
  col *= 0.72 + 0.6 * smoothstep(0.2, 0.8, r.x);
  vec3 ink = vec3(0.02, 0.02, 0.035);
  col = mix(col, ink, u_ink * smoothstep(0.48, 0.95, r.x * 1.1 - f * 0.25 + 0.05));
  float sheen = pow(abs(sin((f + r.x) * 8.5)), 22.0);
  col += sheen * 0.14;
  col *= 1.0 - u_vignette * 0.55 * dot(uv - 0.5, uv - 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;

export type Liquid = {
  canvas: HTMLCanvasElement;
  resize: (w: number, h: number) => void;
  render: (seconds: number) => void;
};

/** Compile the liquid onto a canvas. Returns null when WebGL is unavailable, so callers can fall back to CSS. */
export function createLiquid(
  canvas: HTMLCanvasElement,
  { ink = 1, vignette = 1 }: { ink?: number; vignette?: number } = {},
): Liquid | null {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  const precision = high && high.precision > 0 ? "highp" : "mediump";
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, `precision ${precision} float;\n${FRAG}`));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  gl.uniform1f(gl.getUniformLocation(prog, "u_ink"), ink);
  gl.uniform1f(gl.getUniformLocation(prog, "u_vignette"), vignette);

  return {
    canvas,
    resize(w, h) {
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    },
    render(seconds) {
      gl.uniform1f(uTime, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}

// Seconds on a clock shared by every liquid surface. It starts 20 s in, so the first frame is already well mixed, and
// runs at about a third of the speed when the reader asks for reduced motion (Windows "Animation effects" off, macOS
// "Reduce motion"): a slow ambient drift rather than a frozen frame.
const REDUCED_SPEED = 0.35;
let reduceQuery: MediaQueryList | null | undefined;
let clock = 20;
let lastNow = -1;

export function liquidTime() {
  if (reduceQuery === undefined)
    reduceQuery = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  const now = performance.now() / 1000;
  if (lastNow >= 0) clock += (now - lastNow) * (reduceQuery?.matches ? REDUCED_SPEED : 1);
  lastNow = now;
  return clock;
}
