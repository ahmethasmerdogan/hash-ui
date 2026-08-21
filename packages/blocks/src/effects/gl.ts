/* ------------------------------------------------------------------ */
/* A tiny fragment-shader runner.                                      */
/*                                                                     */
/* Every shader effect in this package wants the same eighty lines:     */
/* compile, link, one full-screen triangle, resize against a capped     */
/* device pixel ratio, stop when off screen or hidden, freeze under     */
/* reduced motion, and delete everything on unmount. Written twice it   */
/* drifts — one copy gets the visibility fix and the other does not.    */
/*                                                                     */
/* Returns a teardown, or null when WebGL is unavailable. A null is     */
/* not an error: callers layer these behind real content and stay       */
/* usable without a GPU.                                                */
/* ------------------------------------------------------------------ */

export type Uniforms = Record<string, number | [number, number] | [number, number, number]>;

export type ShaderOptions = {
  /** called once per frame; return the uniforms for that frame */
  uniforms: (time: number) => Uniforms;
  /** seconds to freeze at when the reader asked for less motion */
  reducedTime?: number;
  /** cap on device pixel ratio — a 4K panel gains nothing and pays per pixel */
  maxDpr?: number;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    /* a shader that fails to compile is a bug in this package, not a
       property of the visitor's machine — say so rather than rendering
       nothing and leaving no trace */
    console.warn("[uicean-blocks] shader failed to compile:\n" + gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export function runShader(
  canvas: HTMLCanvasElement,
  frag: string,
  { uniforms, reducedTime = 6, maxDpr = 2 }: ShaderOptions,
): (() => void) | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false }) as
    | WebGLRenderingContext
    | null;
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[uicean-blocks] shader failed to link:\n" + gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  /* uniform locations are looked up once and cached by name — getUniform-
     Location every frame is a string lookup into the driver */
  const locs = new Map<string, WebGLUniformLocation | null>();
  const loc = (name: string) => {
    if (!locs.has(name)) locs.set(name, gl.getUniformLocation(prog, name));
    return locs.get(name) ?? null;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const start = performance.now();
  let raf = 0;
  let running = true;

  const frame = (now: number) => {
    if (!running) return;
    resize();
    const t = reduce.matches ? reducedTime : (now - start) / 1000;

    gl.uniform2f(loc("u_res"), canvas.width, canvas.height);
    gl.uniform1f(loc("u_time"), t);
    for (const [name, value] of Object.entries(uniforms(t))) {
      const l = loc(name);
      if (!l) continue;
      if (typeof value === "number") gl.uniform1f(l, value);
      else if (value.length === 2) gl.uniform2f(l, value[0], value[1]);
      else gl.uniform3f(l, value[0], value[1], value[2]);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    /* under reduced motion one frame is the whole animation; drawing it
       again sixty times a second is pure heat */
    if (reduce.matches) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const play = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  raf = requestAnimationFrame(frame);

  /* off screen or a background tab: stop. A page of these otherwise keeps
     a GPU busy drawing things nobody is looking at. */
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()));
  io.observe(canvas);
  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", resize);

  return () => {
    pause();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", resize);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buf);
  };
}
