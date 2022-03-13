import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/api";

interface AuthProviderProps {
  children: ReactNode;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  user: User;
}

const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

const signOut = () => {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");
  authChannel.postMessage("signOut");
  Router.push("/");
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  const signIn = async ({ email, password }: SignInCredentials) => {
    const { data } = await api.post("/sessions", { email, password });
    const { permissions, roles, token, refreshToken } = data;

    setCookie(undefined, "nextauth.token", token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    setCookie(undefined, "nextauth.refreshToken", refreshToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser({ email, permissions, roles });

    authChannel.postMessage("signIn");

    Router.push("/dashboard");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { "nextauth.token": token } = parseCookies();

        if (token) {
          const { data } = await api.get("/me");
          const { permissions, roles, email } = data;
          setUser({ permissions, roles, email });
        }
      } catch (error) {
        signOut();
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          authChannel.close();
          break;
        case "signIn":
          Router.push("/dashboard");
          break;
        default:
          break;
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, signOut };
