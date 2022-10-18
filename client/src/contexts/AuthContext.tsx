import { LoginRequest, useAuthService } from "@services/AuthService";
import React, { PropsWithChildren, useContext, useState } from "react";

import jwtDecode from "jwt-decode";

export type AuthUser = {
  userName?: string;
  userEmail: string;
};

export type AuthActions = {
  login: (request: LoginRequest) => Promise<any>;
  logout: () => any;
};

export type LoggedContext = { isLoggedIn: true } & AuthUser & Pick<AuthActions, "logout">;
export type UnloggedContext = { isLoggedIn: false } & Pick<AuthActions, "login">;

export type IAuthContext = LoggedContext | UnloggedContext;

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  login: async () => {},
});

const computeInitialState = (tokenKey: string): AuthUser | null => {
  const token = localStorage.getItem(tokenKey);

  if (!token) return null;

  return jwtDecode<AuthUser>(token);
};

export const AuthProvider = ({ children }: PropsWithChildren<any>) => {
  const tokenKey = "bahamut::user-token";
  const [user, setUser] = useState<AuthUser | null>(computeInitialState(tokenKey));

  const { login: loginService } = useAuthService();

  const login = async (request: LoginRequest) => {
    const { token } = await loginService(request);

    const user = jwtDecode<AuthUser>(token);

    setUser(user);

    localStorage.setItem(tokenKey, token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(tokenKey);
  };

  const state: IAuthContext = user
    ? { isLoggedIn: true, ...user, logout }
    : { isLoggedIn: false, login };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export const useUnloggedAuthContext = (): UnloggedContext => {
  const context = useContext(AuthContext);

  // if (context.isLoggedIn) throw new Error("User is logged in!");

  return context as unknown as UnloggedContext;
};

export const useLoggedAuthContext = (): LoggedContext => {
  const context = useContext(AuthContext);

  // if (!context.isLoggedIn) throw new Error("User is logged out!");

  return context as unknown as LoggedContext;
};
