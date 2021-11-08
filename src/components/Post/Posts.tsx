import axios from "axios";
import React, { useLayoutEffect } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import Post from "./Post";

// post를 서버에서 가져오고 저장
const Posts = () => {
  const [posts, setPosts] = React.useState<IPost[]>([]);

  const setPost = (i: number) => {
    return (newPost: IPost) => {
      setPosts([...posts.slice(0, i), newPost, ...posts.slice(i + 1)])
    }
  }

  const postComeFirst = (i: number) => {
    setPosts([posts[i], ...posts.slice(0, i), ...posts.slice(i + 1)])
  }

  useLayoutEffect(() => {
    axios.get(`${backServer}/posts/`)
      .then(res => {
        setPosts(res.data as IPost[]);
      })
  }, [])

  return (
    <div className="posts">
      {posts.map((post, i) => {
        const { _id } = post;
        return <Post key={_id} {...post} setPost={setPost(i)} postComeFirst={() => postComeFirst(i)} />
      })}
    </div>
  )
}

export default Posts;