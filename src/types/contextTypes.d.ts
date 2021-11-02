import { IUser } from "../types/postTypes"

export interface IAuthContext {
  isAuthenticated: boolean,
  setIsAuthenticated: (auth: boolean) => void,
  user: IUser,
  setUser: (user: IUser) => void,
}