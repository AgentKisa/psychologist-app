import Head from "next/head";
import Home from "../components/Home/Home";

export default function Page() {
  return (
    <div>
      <Home />
      <Head>
        <title>Psychologist App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>
    </div>
  );
}
