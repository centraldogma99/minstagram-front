// 어떤 post에 속해 있는지 넣어야 하나?
export interface IComment {
  author: IUser,
  content: string,
  likes: ILike[]
}

export interface ILike {
  author: IUser
}

export interface IPost {
  // author은 토큰 또는 objectID와 같은 일련번호.
  _id: string,
  author: IUser,
  pictures: string[],
  likes: ILike[],
  comments: IComment[],
}

export interface IUser {
  _id: string,
  name: string,
  avatar: string
}