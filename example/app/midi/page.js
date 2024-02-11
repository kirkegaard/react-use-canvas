"use client";

import { useEffect, useState } from "react";
import { useMIDI, useMIDINote, useMIDIControl } from "@react-midi/hooks";

import { useWindowSize } from "@uidotdev/usehooks";
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

uniform mat4 u_midi01;
uniform mat4 u_midi02;
uniform float u_time;
uniform vec2 u_resolution;

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

    for(float i = 0., e = 0., j = 0.; i++ < 35.0 * u_midi01[2][2];) {
      p = d * j / u_midi01[2][1];
      p.z += 1.0 + u_time / 1. * u_midi01[0][3];
      p.xy -= 3.15;
      p = asin(sin(p / 2.) * .8) * 1.2;
      float sc = .4 * u_midi01[2][0];

      for(float j = 0.0; j++ < 6.;) {
        p.xy = abs(p.xy) - .35;
        p.xy *= 1. + u_midi01[0][0];
        p = erot(p, normalize(vec3(
          u_midi01[1][0],
          u_midi01[1][1],
          u_midi01[1][2]
        )), -.785);
        sc *= 1.25;
      }

      float h = box2(
        erot(
          p,
          vec3(.0, .0, 1.2),
          floor(1.0 + length(uv * uv) + pow(dot(uv, uv), 1.0) * .5)).xy,
          vec2(.01)
        );

      h = min(h, box2(p.xz, vec2(u_midi01[3][0] / 2.)));
      h = min(h, box2(p.yz, vec2(u_midi01[3][1] / 2.)));
      h /= sc;
      j += e = max(.001, h);

      col += (.8 + .3 * cos(vec3(.075, 2.1, .16) * i + floor(1. / 10. + length(uv * uv)))) * .1 / exp((.8 + p.z * .01) * i * i * e);
    }

    float r = u_midi02[1][0] * (1. + u_midi02[0][0]);
    float g = u_midi02[1][1] * (1. + u_midi02[0][1]);
    float b = u_midi02[1][2] * (1. + u_midi02[0][2]);
    float a = u_midi02[1][3] * (1. + u_midi02[0][3]);

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

const normalize = (val, min, max) => (val - min) / (max - min);

export default function FullPage() {
  const [midi, setMidi] = useState([
    [
      0.1889763779527559, 0, 0, 0.007874015748031496, 0.06299212598425197, 0,
      0.25196850393700787, 0, 0.6535433070866141, 1, 1, 0, 0,
      0.031496062992125984, 0, 0,
    ],
    [
      0.8818897637795275, 0.08661417322834646, 0.1889763779527559, 1, 0,
      0.47244094488188976, 0.5905511811023622, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  ]);

  const { inputs } = useMIDI();
  const { control: value, value: control } = useMIDIControl(inputs[0]);

  let uniformTime = null;
  let uniformResolution = null;

  let uniformMidi01 = null;
  let uniformMidi02 = null;

  const setup = ({ context: gl, width, height }) => {
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

    uniformTime = createUniform(gl, program, "1f", "u_time");
    uniformResolution = createUniform(gl, program, "2f", "u_resolution");
    uniformMidi01 = createUniform(gl, program, "Matrix4fv", "u_midi01");
    uniformMidi02 = createUniform(gl, program, "Matrix4fv", "u_midi02");

    gl.useProgram(program);

    gl.bindVertexArray(vao);
  };

  const draw = ({ context: gl, time, width, height }) => {
    uniformTime(time);
    uniformResolution(width, height);
    uniformMidi01(false, midi[0]);
    uniformMidi02(false, midi[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const boards = [
    { start: 32, end: 47 },
    { start: 48, end: 55 },
  ];

  useEffect(() => {
    for (const [index, board] of boards.entries()) {
      if (control >= board.start && control <= board.end) {
        const k = Math.round(
          normalize(control, board.start, board.end) * (board.end - board.start)
        );
        const v = normalize(value, 0, 127);
        midi[index][k] = v;
        window.localStorage.setItem("midi", JSON.stringify(midi));
      }
    }
  }, [value]);

  useEffect(() => {
    const current = window.localStorage.getItem("midi");
    if (current) {
      setMidi(JSON.parse(current));
    }
  }, []);

  const { height, width } = useWindowSize();
  const { ref } = useCanvas({
    setup,
    draw,
    options: {
      height,
      width,
      contextType: "webgl2",
      contextAttributes: {
        antialias: false,
      },
    },
  });

  return <canvas ref={ref} />;
}
