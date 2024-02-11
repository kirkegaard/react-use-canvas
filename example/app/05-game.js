"use client";
import { useEffect, useState, useRef } from "react";
import { useCanvas } from "@kirkegaard/react-use-canvas";

const useInput = () => {
  const input = useRef([]);

  useEffect(() => {
    const onKeyUp = (event) => {
      const idx = input.current.indexOf(event.key);
      input.current.splice(idx, 1);
    };

    const onKeyDown = (event) => {
      if (!input.current.includes(event.key)) {
        input.current.push(event.key);
      }
    };

    addEventListener("keyup", onKeyUp);
    addEventListener("keydown", onKeyDown);

    return () => {
      removeEventListener("keyup", onKeyUp);
      removeEventListener("keydown", onKeyDown);
    };
  }, [input]);

  return input;
};

export function Game() {
  const input = useInput();

  let ENEMIES = [];
  let BULLETS = [];
  let PLAYER;

  const State = {
    gameOver: true,
  };

  const Alien = (options, context) => {
    let { x, y, size = 10 } = options;

    const getProps = () => ({ x, y, size });

    const update = () => {};

    const draw = () => {
      context.beginPath();
      context.rect(x - size / 2, y - size / 2, size, size);
      context.fillStyle = "red";
      context.fill();
      context.closePath();
    };

    return { update, draw, getProps };
  };

  const Bullet = (options, context) => {
    let { x, y, size = 5 } = options;

    const getProps = () => ({ x, y, size });

    const update = () => {
      y -= 5;
    };

    const draw = () => {
      context.beginPath();
      context.rect(x - size / 2, y, 5, 5);
      context.fillStyle = "white";
      context.fill();
      context.closePath();
    };

    return { update, draw, getProps };
  };

  const Ship = (options, context) => {
    let { x, y, speed, size, isShooting = false } = options;

    const update = ({ width }) => {
      if (input.current.includes("ArrowLeft")) {
        x = x <= 0 ? 0 : x - speed;
      }
      if (input.current.includes("ArrowRight")) {
        x = x >= width - size ? width - size : x + speed;
      }
      if (input.current.includes(" ")) {
        if (!isShooting) {
          isShooting = true;
          BULLETS.push(Bullet({ x: x, y }, context));
        }
      } else {
        isShooting = false;
      }
    };

    const draw = () => {
      context.beginPath();
      context.rect(x - size / 2, y - size / 2, size, size);
      context.fillStyle = "white";
      context.fill();
      context.closePath();
    };

    return { update, draw };
  };

  const setup = ({ context, height, width }) => {
    // Make sure the enemies array is empty because rerender things :(
    ENEMIES = [];
    BULLETS = [];

    PLAYER = Ship(
      { x: width / 2, y: height - 20, speed: 2, size: 20 },
      context
    );

    const col = 5;
    const row = 4;
    const xc = width / col;
    const yr = 200 / row;

    for (let i = 1; i < col; i++) {
      for (let j = 1; j < row; j++) {
        ENEMIES.push(Alien({ x: xc * i, y: yr * j }, context));
      }
    }
  };

  const draw = ({ context, time, height, width }) => {
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();

    if (ENEMIES.length <= 0) {
      // Reset
      setup({ context, height, width });
      State.gameOver = true;
    }

    if (State.gameOver) {
      if (input.current.includes("Enter")) {
        State.gameOver = false;
      }

      context.textAlign = "center";
      context.font = "20px arial";
      context.fillStyle = "white";
      context.fillText("Press enter to start game", width / 2, height / 2);
      return;
    }

    PLAYER.update({ height, width });
    PLAYER.draw({ height, width });

    for (const [enemyIdx, enemy] of ENEMIES.entries()) {
      const enemyProps = enemy.getProps();
      for (const [bulletIdx, bullet] of BULLETS.entries()) {
        const bulletProps = bullet.getProps();
        if (
          enemyProps.y + enemyProps.size >= bulletProps.y &&
          enemyProps.y - enemyProps.size <= bulletProps.y &&
          enemyProps.x + enemyProps.size >= bulletProps.x &&
          enemyProps.x - enemyProps.size <= bulletProps.x
        ) {
          BULLETS.splice(bulletIdx, 1);
          ENEMIES.splice(enemyIdx, 1);
        }
      }

      enemy.update();
      enemy.draw();
    }

    for (const [bulletIdx, bullet] of BULLETS.entries()) {
      const bulletProps = bullet.getProps();

      if (bulletProps.y <= 0) {
        BULLETS.splice(bulletIdx, 1);
      }

      bullet.update();
      bullet.draw();
    }
  };

  const { ref } = useCanvas({
    setup,
    draw,
    options: { height: 600, width: 350 },
  });

  return <canvas ref={ref} />;
}
