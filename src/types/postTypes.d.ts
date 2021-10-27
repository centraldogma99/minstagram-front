// 어떤 post에 속해 있는지 넣어야 하나?
export interface IComment {
  authorName: string,
  content: string,
  likes: ILike[]
}

export interface ILike {
  authorName: string
}

export interface IPost {
  // author은 토큰 또는 objectID와 같은 일련번호.
  _id: string,
  authorName: string,
  pictures: string[],
  likes: ILike[],
  comments: IComment[],
}