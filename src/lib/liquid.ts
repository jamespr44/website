/**
 * The iridescent "liquid": domain-warped fbm mapped through sage → amber → oxblood with a thin sheen.
 * Shared by the hero backdrop and the liquid-filled key figures so both show exactly the same material.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_ink;      // how far the darkest folds sink towards black (1 = hero, lower keeps figures colourful)
uniform float u_vignette; // edge darkening (hero only)
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
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
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 5.2));
  vec2 r = vec2(fbm(p * 1.5 + 3.0 * q + vec2(1.7, 9.2) + 0.6 * t), fbm(p * 1.5 + 3.0 * q + vec2(8.3, 2.8) - 0.5 * t));
  float f = fbm(p * 1.1 + 3.2 * r);

  vec3 sage = vec3(0.627, 0.878, 0.671);
  vec3 amber = vec3(1.0, 0.674, 0.18);
  vec3 ox = vec3(0.647, 0.176, 0.145);
  vec3 ink = vec3(0.035, 0.02, 0.02);

  vec3 col = mix(ox, amber, smoothstep(0.32, 0.68, f));
  col = mix(col, sage, smoothstep(0.5, 0.88, q.x * 0.6 + r.y * 0.7));
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
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
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

/** Seconds on a clock shared by every liquid surface, offset so the first frame is already well mixed. */
export const liquidTime = () => (performance.now() + 20000) / 1000;
