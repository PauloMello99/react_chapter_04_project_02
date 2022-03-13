import { Can } from "../components/Can";
import { useAuth } from "../hooks/auth";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      <button type="button" onClick={signOut}>
        Logout
      </button>

      <Can permissions={["metrics.list"]}>
        <h2>Métricas</h2>
      </Can>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // const api = setupAPIClient(ctx);
  // const response = await api.get("/me");
  return { props: {} };
});
