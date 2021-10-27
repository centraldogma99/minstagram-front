import axios from "axios";
import React, { useLayoutEffect } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import Post from "./Post";


const Posts = (props: { posts?: IPost[] }) => {
  const [posts, setPosts] = React.useState<IPost[]>(props.posts ?? []);

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
        console.log(post);
        const { _id, authorName, pictures, likes, comments } = post;
        return <Post key={_id} _id={_id} authorId={authorName} pictures={pictures} likes={likes} comments={comments} />
      })}
    </div>
  )
}

export default Posts;