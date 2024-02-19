import Link from "next/link";
import { Simple } from "./01-simple";
import { States } from "./02-state";
import { Props } from "./03-props";
import { WebGL } from "./04-webgl";
import { Game } from "./05-game";
import { Confetti } from "./06-confetti";

import styles from "./page.module.css";

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
        <p>
          The hook exposes a few states. <samp>isPaused</samp> holds the pause
          state. <samp>fps</samp> holds the current frames per second.
        </p>
        <p>
          You&apos;ll of course also get setters for those props. Use{" "}
          <samp>setIsPaused</samp> and <samp>setFPS</samp> to set the state
          explicitly. Or use <samp>pause</samp> to toggle the pause state.
        </p>
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
          to render shaders! Here&apos;s one created by{" "}
          <a href="https://www.shadertoy.com/view/mtyGWy">kishimisu</a>. I do
          have plans for integrating a proper pipeline in the hook but for now
          you&apos;ll have to write your own. Or copy the one from the example
          :)
        </p>
        <p>
          I&apos;ve also added <Link href="/midi">another example</Link> where
          you can use midi controllers to control the shader.
        </p>
        <WebGL />
      </section>
      <section>
        <h2>Game</h2>
        <p>You can even make games! Although its probably not practical :D</p>
        <Game />
      </section>
      <section>
        <h2>Confetti</h2>
        <p>How about some confetti</p>
        <Confetti />
      </section>
    </main>
  );
}
