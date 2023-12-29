import { Example01 } from "./Example01";
import { Example02 } from "./Example02";
import { Example03 } from "./Example03";
import { Example04 } from "./Example04";

import "./App.css";

function App() {
  return (
    <main>
      <h1>useCanvas</h1>
      <p>
        A tiny hook that'll help you write neat canvas things. If you're
        familiar with processing it might seem familiar :)
      </p>
      <h2>Example01</h2>
      <Example01 />
      <h2>Example02</h2>
      <Example02 />
      <h2>Example03</h2>
      <Example03 />
      <h2>Example04</h2>
      <Example04 />
    </main>
  );
}

export default App;
