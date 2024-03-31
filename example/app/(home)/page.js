"use client";

import Link from "next/link";

import { WebGL } from "components/examples/Webgl";

export default function Home() {
  return (
    <article>
      <p>
        A tiny hook that&apos;ll help you write neat canvas things. If
        you&apos;re familiar with processing it might seem familiar.
      </p>
      <WebGL />
    </article>
  );
}
