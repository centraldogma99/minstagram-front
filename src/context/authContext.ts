import { createContext } from "react";
import { IAuthContext } from "../types/contextTypes";
import { IUser } from "../types/postTypes";

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsAuthenticated: () => { },
  user: { _id: "", name: "", avatar: "", email: "" },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => { }
});

export default AuthContext;