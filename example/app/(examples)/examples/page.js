import { Simple } from "components/examples/Simple";
import { WebGL } from "components/examples/Webgl";
import { Game } from "components/examples/Game";
import { Confetti } from "components/examples/Confetti";
import { BounceText } from "components/examples/BounceText";
import { Math } from "components/examples/Math";

import styles from "./page.module.css";

const Examples = () => {
  return (
    <article className={styles.examples}>
      <section>
        <h3>Simple</h3>
        <Simple />
      </section>
      <section>
        <h3>Confetti</h3>
        <Confetti />
      </section>
      <section>
        <h3>Bouncing text</h3>
        <BounceText />
      </section>
      <section>
        <h3>WebGL</h3>
        <WebGL />
        <p>
          <a href="https://www.instagram.com/p/C3Oh8Nwst0z/">Source</a>
        </p>
      </section>
      <section>
        <h3>Game</h3>
        <Game />
      </section>
    </article>
  );
};

export default Examples;
