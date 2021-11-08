/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
import { IPost } from "../types/postTypes";

interface IPostContext {
  post: IPost,
  deletePost: () => void,
  editPost: (text: string) => void,
}

const PostContext = createContext<IPostContext>({
  post: {} as IPost,
  deletePost: () => { },
  editPost: (text: string) => { }
});

export default PostContext;