import { useEffect, useRef } from "react";
import { cx } from "hash-ui";

/* ------------------------------------------------------------------ */
/* NeuralVortex                                                        */
/*                                                                     */
/* A full-bleed backdrop of swirling filaments that lean towards the   */
/* pointer. One fragment shader, no libraries — the original needs no  */
/* npm dependency either, so this is the one effect that ports across  */
/* essentially intact.                                                 */
/*                                                                     */
/* The look comes from domain warping: sample a cheap sine field,      */
/* feed the result back into itself a few times, then take 1/distance  */
/* of the final value so the bright cores stay thin and the falloff    */
/* stays wide. That reciprocal is what reads as light rather than      */
/* paint, and it is why this block is allowed to glow at all.          */
/* ------------------------------------------------------------------ */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;
uniform vec3  u_color;
uniform float u_intensity;

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

/* Neuro noise: fifteen rotated sine layers, each feeding its own phase into
   the next. The feedback (sine_acc) is what bends the bands into filaments
   instead of leaving them as stripes, and dividing each layer by a growing
   scale is what keeps the fine detail from swamping the broad shape. */
float neuro(vec2 uv, float t) {
  vec2 acc = vec2(0.0);
  vec2 res = vec2(0.0);
  float scale = 8.0;

  for (int j = 0; j < 15; j++) {
    uv = rot(1.0) * uv;
    acc = rot(1.0) * acc;
    vec2 layer = uv * scale + float(j) + acc - t;
    acc += sin(layer);
    res += (0.5 + 0.5 * cos(layer)) / scale;
    scale *= 1.2;
  }
  return res.x + res.y;
}

void main() {
  /* square-aspect UV centred on 0 so the field never stretches */
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);

  /* the pointer bends the field rather than moving it: the filaments stay
     where they are and only their shape leans */
  vec2 lean = (u_pointer * 2.0 - 1.0) * vec2(1.0, -1.0);
  uv += lean * 0.18;
  uv = rot(length(uv) * 0.5 - u_time * 0.05) * uv;

  float shape = neuro(uv * 0.55, u_time * 0.6);

  /* pow() is the contrast knob. Too high and the field collapses to a few
     dim threads on a black plate; this pair keeps the filaments distinct
     while still letting the sheet between them carry colour. */
  float v = pow(max(shape - 0.18, 0.0) * 1.15, 1.9) * u_intensity;

  /* fall away near the very edge only, so the field still fills its box */
  v *= smoothstep(2.15, 0.6, length(uv));
  v = clamp(v * 1.6, 0.0, 1.0);

  /* white-hot cores over a coloured body: light, not paint */
  vec3 col = mix(u_color, vec3(1.0), smoothstep(0.45, 0.95, v) * 0.7);

  gl_FragColor = vec4(col * v, v);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** "#34d399" → [0.204, 0.827, 0.6] */
function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [0.2, 0.83, 0.6];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export type NeuralVortexProps = {
  /** filament colour, any 6-digit hex */
  color?: string;
  /** how hot the cores burn, 0.5 → 2 is the useful range */
  intensity?: number;
  /** animation speed multiplier */
  speed?: number;
  className?: string;
};

export function NeuralVortex({
  color = "#34d399",
  intensity = 1,
  speed = 1,
  className,
}: NeuralVortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* uniforms that change every frame live in a ref, so a moving pointer
     never re-renders React — the canvas is the only thing that updates */
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const opts = useRef({ color, intensity, speed });
  opts.current = { color, intensity, speed };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { alpha: true, antialias: false }) as
        | WebGLRenderingContext
        | null) ?? null;
    /* no WebGL: leave the canvas transparent. Callers layer this behind
       real content, so the block stays perfectly usable without it. */
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    /* one full-screen triangle pair */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uPointer = gl.getUniformLocation(prog, "u_pointer");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      /* cap at 2× — a 4K panel gains nothing here and pays for every pixel */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.current = {
        x: (e.clientX - r.left) / (r.width || 1),
        y: (e.clientY - r.top) / (r.height || 1),
      };
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      resize();
      /* frozen at a pleasant frame when the reader asked for less motion */
      const t = reduce.matches ? 6 : ((now - start) / 1000) * opts.current.speed;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uPointer, pointer.current.x, pointer.current.y);
      gl.uniform3fv(uColor, hexToRgb(opts.current.color));
      gl.uniform1f(uIntensity, opts.current.intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /* stop burning GPU while the block is off screen or the tab is hidden */
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cx("absolute inset-0 size-full", className)}
    />
  );
}
