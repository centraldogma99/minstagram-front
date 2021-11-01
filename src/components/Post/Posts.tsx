import axios from "axios";
import React, { useLayoutEffect } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import Post from "./Post";

// post를 서버에서 가져오고 저장
const Posts = () => {
  const [posts, setPosts] = React.useState<IPost[]>([]);

  useLayoutEffect(() => {
    axios.get(`${backServer}/posts/`)
      .then(res => {
        console.log("data: " + res.data);
        setPosts(res.data as IPost[]);
      })
  }, [])

  return (
    <div className="posts">
      {posts.map(post => {
        const { _id, author, pictures, likes, comments } = post;
        return <Post key={_id} _id={_id} author={author} pictures={pictures} likes={likes} comments={comments} />
      })}
    </div>
  )
}

export default Posts;