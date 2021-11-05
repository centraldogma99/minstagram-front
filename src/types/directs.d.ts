import { IUser } from "./postTypes";

export interface IDirectRoom {
  _id: string,
  members: IUser[],
  messages: IDirectMessage[],
}

export interface IDirectMessage {
  author: IUser,
  content: string,
  timestamp: Date
}