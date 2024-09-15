import React from "react";

import { Like } from "../../components/Like/Like.jsx";
import { Links } from "../../components/Links/Links.jsx";
import { getCount } from "../../counterState.js";
import { Layout } from "../Layout.js";

export default function Home() {
  return (
    <Layout>
      <h1>Home</h1>
      counter state: {getCount()}
      <Links />
      <Like />
    </Layout>
  );
}
