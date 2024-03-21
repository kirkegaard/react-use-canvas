"use client";

import Link from "next/link";
import { useCanvas } from "@kirkegaard/react-use-canvas";
import { useState } from "react";

import { Simple } from "./01-simple";
import { States } from "./02-state";
import { Props } from "./03-props";
import { WebGL } from "./04-webgl";
import { Game } from "./05-game";
import { Confetti } from "./06-confetti";
import { BounceText } from "./07-bounce-text";
// import { Math } from "./08-math";

import styles from "./page.module.css";

const Effect = () => {
  const radius = 20;

  const height = 250;
  const width = 250;

  const [isPlaying, setIsPlaying] = useState(true);

  const { ref, time, reset, context } = useCanvas({
    onInit: setup,
    onUpdate: draw,
    isPlaying,
    // onComplete: () => ({ shouldRepeat: true, newStartAt: 0 }),
    // duration: 5,
  });

  function setup() {
    context.translate(width / 2, height / 2);
  }

  function draw() {
    context.clearRect(-width / 2, -height / 2, width, height);
    const x = (Math.cos(time * 1.25) * (radius * 2 - width)) / 2;
    const y = (Math.sin(time * 2.5) * (radius * 2 - height)) / 2;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
  }

  return (
    <div>
      <div>
        <canvas ref={ref} />
      </div>
      <div>{Math.round(time)}</div>
      <button onClick={() => setIsPlaying(!isPlaying)}>pause</button>
      <button onClick={() => reset()}>reset</button>
    </div>
  );
};

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>useCanvas</h1>
      <p>
        A tiny hook that&apos;ll help you write neat canvas things. If
        you&apos;re familiar with processing it might seem familiar.
      </p>

      <section>
        <h2>Simple</h2>
        <p>
          In its simplest form the hook takes a <samp>setup</samp> and a{" "}
          <samp>draw</samp> function. You can mix and match them as you will but
          worth keeping in mind is that <samp>setup</samp> is triggered once and{" "}
          <samp>draw</samp> is triggered over and over again.
        </p>
        <p>
          In return you&apos;ll get a <samp>ref</samp> which you need to attach
          to your canvas.
        </p>
        <Simple />
      </section>
      <section>
        <h2>State</h2>
        <States />
      </section>
      <section>
        <h2>Props</h2>
        <p>
          The draw function exposes a few props. Like <samp>setup</samp>{" "}
          you&apos;ll get the usual <samp>context</samp>, <samp>height</samp>,
          and <samp>width</samp>.
        </p>
        <p>
          Besides that you&apos;ll also get <samp>time</samp> which is a frame
          count and <samp>isPaused</samp> which should be self explanatory.
        </p>
        <Props />
      </section>
      <section>
        <h2>WebGL</h2>
        <p>
          If you&apos;re willing to write a shader pipeline, you can even use it
          to render shaders!{" "}
          <a href="https://www.instagram.com/p/C3Oh8Nwst0z/">
            Here&apos;s an old one from some time ago
          </a>
          . I do have plans for integrating a proper pipeline in the hook but
          for now you&apos;ll have to write your own. Or copy the one from the
          examples :)
        </p>
        <WebGL />
      </section>
      <section>
        <h2>Game</h2>
        <p>You can even make games! Although its probably not practical :D</p>
        <p>Controls: Arrow and A for shooting</p>
        <Game />
      </section>
      <section>
        <h2>Confetti</h2>
        <p>How about some confetti?</p>
        <Confetti />
      </section>
      <section>
        <h2>Bouncing text</h2>
        <p>Or how about some demo effects like a scroller</p>
        <BounceText />
      </section>
    </main>
  );
  //     <section>
  //       <h2>Math</h2>
  //       <Math />
  //     </section>
  //   </main>
  // );
}
