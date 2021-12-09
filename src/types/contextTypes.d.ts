import { IUser } from "../types/postTypes"

export interface IAuthContext {
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  checkCookie: () => boolean,
  user: IUser,
  setUser: React.Dispatch<React.SetStateAction<IUser>>,
}