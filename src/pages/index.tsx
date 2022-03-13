import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/auth";

import styles from "../styles/Home.module.css";
import { withSSRGuest } from "../utils/withSSRGuest";

const Home: NextPage = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await signIn({ email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Home;

export const getServerSideProps = withSSRGuest(async () => ({ props: {} }));
