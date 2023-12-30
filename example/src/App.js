import { Simple } from "./examples/01-simple";
import { States } from "./examples/02-state";
import { Props } from "./examples/03-props";
import { WebGL } from "./examples/04-webgl";

import "./App.css";

function App() {
  return (
    <main>
      <h1>useCanvas</h1>
      <p>
        A tiny hook that'll help you write neat canvas things. If you're
        familiar with processing it might seem familiar.
      </p>
      <h2>Simple</h2>
      <p>
        In its simplest form the hook takes a <samp>setup</samp> and a{" "}
        <samp>draw</samp> function. You can mix and match them as you will but
        worth keeping in mind is that <samp>setup</samp> is triggered once and{" "}
        <samp>draw</samp> is triggered over and over again.
      </p>
      <p>
        In return you'll get a <samp>ref</samp> which you need to attach to your
        canvas.
      </p>
      <Simple />
      <h2>State</h2>
      <p>
        The hook exposes a few states. <samp>isPaused</samp> holds the pause
        state. <samp>fps</samp> holds the current frames per second.
      </p>
      <p>
        You'll of course also get setters for those props. Use{" "}
        <samp>setIsPaused</samp> and <samp>setFPS</samp> to set the state
        explicitly. Or use <samp>pause</samp> to toggle the pause state.
      </p>
      <States />
      <h2>Props</h2>
      <p>
        The draw function exposes a few props. Like <samp>setup</samp> you'll
        get the usual <samp>context</samp>, <samp>height</samp>, and{" "}
        <samp>width</samp>.
      </p>
      <p>
        Besides that you'll also get <samp>time</samp> which is a frame count
        and <samp>isPaused</samp> which should be self explanatory.
      </p>
      <Props />
      <h2>WebGL</h2>
      <p>
        If you're willing to write a shader pipeline, you can even use it to
        render shaders! Here's one created by{" "}
        <a href="https://www.shadertoy.com/view/mtyGWy">kishimisu</a>. I do have
        plans for integrating a proper pipeline in the hook but for now you'll
        have to write your own. Or copy the one from the example :)
      </p>
      <WebGL />
    </main>
  );
}

export default App;
