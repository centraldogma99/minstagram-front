import { IUser } from "../types/postTypes"

export interface IAuthContext {
  isAuthenticated: boolean,
  setIsAuthenticated: (auth: boolean) => void,
  user: IUser,
  setUser: React.Dispatch<React.SetStateAction<IUser>>,
}