import { createContext } from "react";
import { IAuthContext } from "../types/contextTypes";

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsAuthenticated: () => { },
  user: { _id: "", name: "", avatar: "" }
});

export default AuthContext;