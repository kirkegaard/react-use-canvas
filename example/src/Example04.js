import { useRef, useState } from "react";
import { useCanvas } from "react-use-canvas";

const vertexShaderSource = `#version 300 es

in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

// Made by kishimisu
// https://www.shadertoy.com/view/mtyGWy
const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

layout (location = 0) out vec4 outColor;

vec3 palette( float t ) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263,0.416,0.557);

  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  vec2 uv0 = uv;

  vec3 finalColor = vec3(0.0);

  for (float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;

    float d = length(uv) * exp(-length(uv0));

    vec3 col = palette(length(uv0) + i * .4 + (u_time / 100.0) * .4);

    d = sin(d * 8. + u_time / 100.0) / 8.;
    d = abs(d);

    d = pow(0.01 / d, 1.2);

    finalColor += col * d;
  }

  outColor = vec4(finalColor, 1.0);
}
`;

function compileShader(gl, shaderSource, shaderType) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw "program failed to link:" + gl.getProgramInfoLog(program);
  }

  return program;
}

function createUniform(gl, program, type, name) {
  const location = gl.getUniformLocation(program, name);
  return (...values) => {
    gl[`uniform${type}`](location, ...values);
  };
}

export function Example04() {
  const [isPlaying, setIsPlaying] = useState(true);

  let uniformTime = null;
  let uniformResolution = null;

  const setup = ({ context: gl, width, height }) => {
    const vertexShader = compileShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER,
    );

    const fragmentShader = compileShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER,
    );

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position",
    );

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, width, height);

    uniformTime = createUniform(gl, program, "1f", "u_time");
    uniformResolution = createUniform(gl, program, "2f", "u_resolution");

    gl.useProgram(program);

    gl.bindVertexArray(vao);
  };

  const draw = ({ context: gl, time, width, height }) => {
    uniformTime(time);
    uniformResolution(width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const { ref } = useCanvas({
    setup,
    draw,
    options: {
      width: 500,
      height: 500,
      contextType: "webgl2",
      contextAttributes: {
        antialias: true,
      },
    },
  });

  return <canvas ref={ref} />;
}
