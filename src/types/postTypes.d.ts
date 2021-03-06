// 어떤 post에 속해 있는지 넣어야 하나?
export interface IComment {
  _id: number,
  author: IUser,
  content: string,
  likes: ILike[],
  timestamp: number,
}

export interface ILike {
  author: IUser
}

export interface IPost {
  // author은 토큰 또는 objectID와 같은 일련번호.
  _id: string,
  author: IUser,
  pictures: string[],
  text: string,
  likes: ILike[],
  comments: IComment[],
  isDeleted?: boolean,
  timestamp: number,
}

export interface IUser {
  _id: string,
  name: string,
  avatar: string,
  email: string
}