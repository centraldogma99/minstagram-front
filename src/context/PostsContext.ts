/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

interface IPostsContext {
  deletePost: (i: number) => void,
  editPost: (i: number, text: string) => void,
}

const PostsContext = createContext<IPostsContext>({
  deletePost: (i: number) => { },
  editPost: (i: number, text: string) => { }
});

export default PostsContext;