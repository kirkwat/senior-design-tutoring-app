import { createContext, useState } from "react";

export interface AuthState {
  auth: {
    accessToken?: string;
    role?: "user" | "tutor" | "admin";
    user?: string;
  };
  setAuth: React.Dispatch<React.SetStateAction<{}>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthState>({
  auth: {},
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState<boolean>(() => {
    const localPersist = localStorage.getItem("persist");
    return localPersist !== null ? JSON.parse(localPersist) : false;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
