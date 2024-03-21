"use client";

import { useRef } from "react";
import { useCanvas } from "@kirkegaard/react-use-canvas";

const vs = `#version 300 es

in vec4 position;

void main() {
  gl_Position = position;
}
`;

const fs = `#version 300 es
precision highp float;

out vec4 outColor;

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589793;

float box2(vec2 p,vec2 b) {
    p = abs(p)-b;
    return length(max(vec2(0.),p))+min(0.,max(p.x,p.y));
}

vec3 erot(vec3 p, vec3 ax, float t) {
  return mix(dot(ax,p)*ax,p,cos(t))+cross(ax,p)*sin(t);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;

    vec3 col = vec3(0);
    vec3 p, d = normalize(vec3(uv, .75));

    for(float i = 0., e = 0., j = 0.; i++ < 35.0 * 1.0;) {
      p = d * j / 0.6;
      p.z += 1.0 + u_time / 1. * 0.006;
      p.xy -= PI;
      p = asin(sin(p / 2.) * .8) * 1.2;
      float sc = .4 * 0.65;

      for(float j = 0.0; j++ < 7.;) {
        p.xy = abs(p.xy) - .35;
        p.xy *= 1. + 0.195;
        p = erot(p, normalize(vec3(
          0.28,
          0.0,
          1.
        )), -0.785);
        sc *= 1.25;
      }

      float h = box2(
        erot(
          p,
          vec3(.0, .0, 1.25),
          floor(1.0 + length(uv * uv) + pow(dot(uv, uv), 1.0) * .5)).xy,
          vec2(.01)
        );

      h = min(h, box2(p.xz, vec2(0.1 / 2.0)));
      h = min(h, box2(p.yz, vec2(0.1 / 2.0)));
      h /= sc;
      j += e = max(.001, h);

      col += (.8 + .3 * cos(vec3(.075, 2.1, .16) * i + floor(1. / 10. + length(uv * uv)))) * .1 / exp((.8 + p.z * .01) * i * i * e);
    }

    float r = 0.0 * (1.0 + 0.88);
    float g = 0.4 * (1.0 + 0.08);
    float b = 0.5 * (1.0 + 0.18);

    col *= vec3(r, g, b);

    outColor = vec4(col, 1.0);
}
`;

function compileShader(gl, shaderSource, shaderType) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    throw Error(`Could not compile shader: ${gl.getShaderInfoLog(shader)}`);
  }

  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    throw Error(`Program failed to link: ${gl.getProgramInfoLog(program)}`);
  }

  return program;
}

function createUniform(gl, program, type, name) {
  const location = gl.getUniformLocation(program, name);
  return (...values) => {
    gl[`uniform${type}`](location, ...values);
  };
}

export function WebGL() {
  const uniformTime = useRef(null);
  const uniformResolution = useRef(null);

  const {
    ref,
    time,
    context: gl,
    height,
    width,
  } = useCanvas({
    onInit,
    onUpdate,
    height: 500,
    width: 355,
    contextType: "webgl2",
  });

  function onInit() {
    const vertexShader = compileShader(gl, vs, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fs, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);
    const positionAttributeLocation = gl.getAttribLocation(program, "position");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, width, height);

    uniformTime.current = createUniform(gl, program, "1f", "u_time");
    uniformResolution.current = createUniform(
      gl,
      program,
      "2f",
      "u_resolution"
    );

    gl.useProgram(program);
    gl.bindVertexArray(vao);
  }

  function onUpdate() {
    uniformTime.current(time * 100);
    uniformResolution.current(width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return <canvas ref={ref} />;
}
