/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
import { IPost } from "../types/postTypes";

interface IPostContext {
  post: IPost & { order?: number },
  setOpen: (b: boolean) => void,
}

const PostContext = createContext<IPostContext>({
  post: {} as IPost & { order?: number },
  setOpen: () => { },
});

export default PostContext;