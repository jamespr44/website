"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Domain-warped fbm, mapped through sage → amber → oxblood with a thin liquid sheen.
const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
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
  col = mix(col, ink, smoothstep(0.48, 0.95, r.x * 1.1 - f * 0.25 + 0.05));
  float sheen = pow(abs(sin((f + r.x) * 8.5)), 22.0);
  col += sheen * 0.14;
  col *= 1.0 - 0.55 * dot(uv - 0.5, uv - 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;

/** Full-bleed iridescent liquid. Renders at half resolution, pauses off-screen, holds a still frame for reduced motion. */
export function IridescentBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionSafe();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setFailed(true);
      return;
    }
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let visible = true;
    const start = performance.now() - 20000;
    const draw = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      if (visible && !reduced) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{
        background:
          "radial-gradient(60% 70% at 20% 30%, rgb(160,224,171), transparent 70%), radial-gradient(55% 65% at 70% 55%, rgb(255,172,46), transparent 70%), radial-gradient(70% 70% at 80% 10%, rgb(165,45,37), transparent 70%), #0a0605",
      }}
    >
      {!failed && <canvas ref={ref} className="block h-full w-full" />}
    </div>
  );
}
