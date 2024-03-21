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

  const ENEMIES = useRef([]);
  const BULLETS = useRef([]);
  const PLAYER = useRef(null);

  const State = useRef({
    gameOver: true,
  });

  const Alien = (options, context) => {
    let { x, y, size = 10, speed = 2 } = options;

    const getProps = () => ({ x, y, size });

    const update = ({ time }) => {
      x += Math.sin(time * 2);
      y += 0.75;
    };

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

    const getProps = () => ({ x, y, size });

    const update = ({ width }) => {
      if (input.current.includes("ArrowLeft")) {
        x = x <= 0 ? 0 : x - speed;
      }
      if (input.current.includes("ArrowRight")) {
        x = x >= width - size ? width - size : x + speed;
      }
      if (input.current.includes("a")) {
        if (!isShooting) {
          isShooting = true;
          BULLETS.current.push(Bullet({ x: x, y }, context));
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

    return { update, draw, getProps };
  };

  const onInit = () => {
    // Make sure the enemies array is empty because rerender things :(
    ENEMIES.current = [];
    BULLETS.current = [];

    PLAYER.current = Ship(
      { x: width / 2, y: height - 20, speed: 2, size: 20 },
      context
    );

    const col = 5;
    const row = 4;
    const xc = width / col;
    const yr = 200 / row;

    for (let i = 1; i < col; i++) {
      for (let j = 1; j < row; j++) {
        ENEMIES.current.push(Alien({ x: xc * i, y: yr * j }, context));
      }
    }
  };

  const onUpdate = () => {
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();

    if (State.current.gameOver) {
      onInit();
      if (input.current.includes("Enter")) {
        console.log("starting game");
        State.current.gameOver = false;
      }

      context.textAlign = "center";
      context.font = "20px arial";
      context.fillStyle = "white";
      context.fillText("Press enter to start game", width / 2, height / 2);
      return;
    }

    if (ENEMIES.current.length <= 0) {
      State.current.gameOver = true;
    }

    PLAYER.current.update({ height, width });
    PLAYER.current.draw({ height, width });

    for (const [enemyIdx, enemy] of ENEMIES.current.entries()) {
      const enemyProps = enemy.getProps();

      // If enemy reaches the end end the game
      if (enemyProps.y >= height - enemyProps.size) {
        State.current.gameOver = true;
      }

      enemy.update({ time });
      enemy.draw();
    }

    for (const [enemyIdx, enemy] of ENEMIES.current.entries()) {
      const enemyProps = enemy.getProps();
      const playerProps = PLAYER.current.getProps();

      if (
        enemyProps.y > height ||
        (enemyProps.y + enemyProps.size >= playerProps.y &&
          enemyProps.y - enemyProps.size <= playerProps.y &&
          enemyProps.x + enemyProps.size >= playerProps.x &&
          enemyProps.x - enemyProps.size <= playerProps.x)
      ) {
        State.current.gameOver = true;
      }
    }

    for (const [bulletIdx, bullet] of BULLETS.current.entries()) {
      const bulletProps = bullet.getProps();

      // Check if any bullets are hitting the enemy
      for (const [enemyIdx, enemy] of ENEMIES.current.entries()) {
        const enemyProps = enemy.getProps();

        if (
          enemyProps.y + enemyProps.size >= bulletProps.y &&
          enemyProps.y - enemyProps.size <= bulletProps.y &&
          enemyProps.x + enemyProps.size >= bulletProps.x &&
          enemyProps.x - enemyProps.size <= bulletProps.x
        ) {
          BULLETS.current.splice(bulletIdx, 1);
          ENEMIES.current.splice(enemyIdx, 1);
        }
      }

      if (bulletProps.y <= 0) {
        BULLETS.current.splice(bulletIdx, 1);
      }

      bullet.update();
      bullet.draw();
    }
  };

  const { ref, time, context, height, width, reset } = useCanvas({
    onInit,
    onUpdate,
    height: 600,
    width: 350,
  });

  return <canvas ref={ref} />;
}
