"use client";

import { useEffect, useRef } from "react";

/**
 * Animated WebGL ring shader, used as a section background.
 * Sizes itself to its parent (not the window) and cleans up on unmount.
 * Renders nothing if WebGL is unavailable.
 */

const VERT = `attribute vec2 aPosition; void main(){ gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
mat2 rotate2d(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float variation(vec2 v1, vec2 v2, float strength, float speed){
  return sin(dot(normalize(v1), normalize(v2)) * strength + iTime * speed) / 100.0;
}
vec3 paintCircle(vec2 uv, vec2 center, float rad, float width){
  vec2 diff = center - uv;
  float len = length(diff);
  len += variation(diff, vec2(0.0, 1.0), 5.0, 2.0);
  len -= variation(diff, vec2(1.0, 0.0), 5.0, 2.0);
  float circle = smoothstep(rad - width, rad, len) - smoothstep(rad, rad + width, len);
  return vec3(circle);
}
void main(){
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  uv.x *= 1.5;
  uv.x -= 0.25;
  vec3 bg = vec3(0.0);
  float mask = 0.0;
  float radius = 0.35;
  vec2 center = vec2(0.5);
  mask += paintCircle(uv, center, radius, 0.035).r;
  mask += paintCircle(uv, center, radius - 0.018, 0.01).r;
  mask += paintCircle(uv, center, radius + 0.018, 0.005).r;
  vec2 v = rotate2d(iTime) * uv;
  // Brand-leaning palette: warm gold/amber sweep instead of the rainbow original
  vec3 fg = vec3(1.0, 0.78 + 0.2 * v.y, 0.1 + 0.35 * (v.x * v.x));
  vec3 color = mix(bg, fg, mask);
  color = mix(color, vec3(1.0), paintCircle(uv, center, radius, 0.003).r);
  gl_FragColor = vec4(color, 1.0);
}`;

export default function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) return;

    const compile = (type: number, src: string): WebGLShader | null => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // non-fatal: the component just renders nothing. Use warn (not error)
        // so Next's dev overlay doesn't surface it as an unhandled error.
        console.warn("[ShaderBackground] shader unavailable:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!program || !vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iResLoc = gl.getUniformLocation(program, "iResolution");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let running = false;
    const render = (t: number) => {
      gl.uniform1f(iTimeLoc, t * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    const stop = () => {
      if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    // only burn GPU frames while the section is actually on-screen
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      // NOTE: intentionally NOT calling loseContext() here. In dev Strict Mode
      // the effect remounts and would reuse this same canvas/context; losing it
      // on the first cleanup made the second mount's shader compile fail. The
      // context is freed by GC when the canvas unmounts for real.
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
