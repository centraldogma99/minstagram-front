/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
import { IPost } from "../types/postTypes";

interface IPostContext {
  post: IPost & { order?: number },
}

const PostContext = createContext<IPostContext>({
  post: {} as IPost & { order?: number },
});

export default PostContext;