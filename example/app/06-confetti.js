"use client";

import { useState, useRef } from "react";
import styled from "styled-components";

import { useWindowSize } from "@uidotdev/usehooks";
import { useCanvas } from "@kirkegaard/react-use-canvas";

export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

const Input = styled.input`
  display: flex;
  width: 100%;
`;

const Button = styled.button`
  padding: 1rem;
  border: 0;
  outline: 0;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  &:focus {
    outline: 2px solid yellow;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const Canvas = styled.canvas`
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
`;

export const Confetti = () => {
  const particleCount = useRef(350);
  const PARTICLES = useRef([]);

  const W = 10;
  const H = 6;
  const SIZE = Math.max(W, H);

  const Particle = (opt) => {
    const orig = opt;
    let { x, y, r, velocityX, velocityY, gravity, color, type } = opt;

    const update = () => {
      x += velocityX;
      y += velocityY;
      r += (velocityY * velocityX) / 180;
      velocityY += gravity;
    };

    const draw = () => {
      context.save();
      context.translate(x, y);

      context.rotate(r);
      context.beginPath();

      if (type === 1) {
        context.rect(0, 0, W, H);
      }

      if (type === 2) {
        context.arc(W, H, 2, 0 * Math.PI, 2 * Math.PI);
      }

      context.fillStyle = `hsl(43, 97%, ${color}%)`;
      context.fill();
      context.closePath();

      context.restore();
    };

    const getProps = () => {
      return { x, y };
    };

    return { draw, update, getProps };
  };

  const addParticles = (particleCount = 50) => {
    for (let i = 0; i < particleCount; i++) {
      PARTICLES.current.push(
        Particle({
          x: randomFloat(SIZE * 2, width - SIZE * 2),
          y: randomFloat(-SIZE, -50),
          r: (randomFloat(0, 360) * Math.PI) / 180,
          color: randomInteger(30, 80), // actually light but hsl
          velocityX: randomFloat(-4, 4),
          velocityY: randomFloat(-8, -2),
          gravity: randomFloat(0.05, 0.5),
          type: randomInteger(1, 2),
        })
      );
    }
  };

  const onUpdate = () => {
    context.clearRect(0, 0, width, height);

    for (const [idx, particle] of PARTICLES.current.entries()) {
      const { x, y } = particle.getProps();
      if (x < -SIZE || x > width + SIZE || y > height) {
        PARTICLES.current.splice(idx, 1);
      }

      particle.update();
      particle.draw();
    }
  };

  const { height, width } = useWindowSize();
  const { ref, context, time } = useCanvas({
    onUpdate,
    height,
    width,
    contextAttributes: {
      antialias: false,
    },
  });

  return (
    <div>
      <p>Particles</p>
      <Input
        type="range"
        min="1"
        max="1000"
        defaultValue={particleCount.current}
        onChange={(e) => {
          particleCount.current = e.target.value;
        }}
      />
      <Button onClick={() => addParticles(particleCount.current)}>
        Add particles
      </Button>
      <Canvas ref={ref} />
    </div>
  );
};
