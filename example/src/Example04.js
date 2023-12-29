import { useRef, useState } from "react";
import { useCanvas } from "react-use-canvas";

const vertexShaderSource = `#version 300 es
precision highp float;

out vec2 texCoord;

void main() {
  float x = float((gl_VertexID & 1) << 2);
  float y = float((gl_VertexID & 2) << 1);
  texCoord.x = x * 0.5;
  texCoord.y = y * 0.5;
  gl_Position = vec4(x - 1.0, y - 1.0, 0, 1);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 texCoord;

uniform float u_time;

layout (location = 0) out vec4 outColor;

void main() {
   outColor = vec4(
    abs(cos(u_time / 100.0)),
    texCoord.y,
    abs(sin(u_time / 100.0)
  ), 1.0);
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

export function Example04() {
  const programRef = useRef(null);
  const bufferRef = useRef(null);

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

    programRef.current = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(programRef.current);
  };

  const draw = ({ context: gl, time, height, width }) => {
    const u_time = gl.getUniformLocation(programRef.current, "u_time");
    gl.uniform1f(u_time, time);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
  };

  const { ref } = useCanvas({
    setup,
    draw,
    options: {
      contextType: "webgl2",
      contextAttributes: {
        antialias: true,
      },
    },
  });

  return <canvas ref={ref} />;
}
