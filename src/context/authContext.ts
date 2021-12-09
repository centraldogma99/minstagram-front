/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
import { IAuthContext } from "../types/contextTypes";

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  checkCookie: () => { return false; },
  user: { _id: "", name: "", avatar: "", email: "" },
  setUser: () => { }
});

export default AuthContext;