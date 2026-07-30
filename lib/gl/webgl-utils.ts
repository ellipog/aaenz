/**
 * Small WebGL2 helpers shared by the agency micro-interaction surfaces
 * (CursorField, UnchartedField, SummitFlag). These keep each feature's
 * component free of boilerplate and guarantee consistent fallback +
 * lifecycle behaviour.
 */

/** Compile + link a GLSL ES 3.00 program; throws with the info log on failure. */
export function createProgram(
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string,
): WebGLProgram {
  const v = compile(gl, gl.VERTEX_SHADER, vert);
  const f = compile(gl, gl.FRAGMENT_SHADER, frag);
  const program = gl.createProgram();
  if (!program) throw new Error("createProgram: gl.createProgram returned null");
  gl.attachShader(program, v);
  gl.attachShader(program, f);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "(no log)";
    throw new Error(`Program link failed: ${log}`);
  }
  return program;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader returned null");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "(no log)";
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

/** A single full-screen triangle (covers the clip cube; no diagonal seam). */
export function initFullscreenGeometry(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer } {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error("createVertexArray returned null");
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  if (!vbo) throw new Error("createBuffer returned null");
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return { vao, vbo };
}

/** Read a CSS custom property from :root as an [r,g,b] 0–1 triple. */
export function cssColor(varName: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return fallback;
  const hex = raw.startsWith("#") ? raw : hexFromCss(raw);
  if (!hex) return fallback;
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function hexFromCss(_raw: string): string | null {
  // Only hex palette vars are used; rgb()/etc. intentionally unsupported.
  return null;
}

/**
 * Set up a canvas backing store at its CSS size × dpr, and a viewport to match.
 * Returns the CSS pixel size the caller should treat as the drawing area.
 */
export function syncCanvasSize(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, dprCap = 2): void {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
}
