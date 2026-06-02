import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getStoredUser, logout as logoutService } from "@/services/auth.service";
import type { User } from "@/types/domain";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  setAuthUser: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const queryClient = useQueryClient();

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user?.token),
    setAuthUser: setUser,
    logout: () => {
      logoutService();
      setUser(null);
      queryClient.clear();
    }
  }), [queryClient, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthState() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthState must be used inside AuthProvider");
  return context;
}
