import axios from "axios";
import React, { useLayoutEffect } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import { Snackbar } from "@mui/material";
import Post from "./Post";
import ToastContext from "../../context/ToastContext";
import { useParams } from "react-router-dom";

// post를 서버에서 가져오고 저장
const Posts = (props: { posts?: IPost[], postIds?: string[] }) => {
  const [posts, setPosts] = React.useState<IPost[]>(props.posts ?? []);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const setPost = (i: number) => {
    return (newPost: IPost) => {
      setPosts([...posts.slice(0, i), newPost, ...posts.slice(i + 1)])
    }
  }

  const postComeFirst = (i: number) => {
    setPosts([posts[i], ...posts.slice(0, i), ...posts.slice(i + 1)])
  }

  useLayoutEffect(() => {
    if (posts.length === 0) {
      axios.get(`${backServer}/posts/`, { params: { pageSize: 50 } })
        .then(res => {
          console.log(res.data)
          setPosts(res.data as IPost[]);
        })
    }
  }, [posts])

  const handleToastClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setToastOpen(false);
  };

  return (
    <div className="posts">
      <ToastContext.Provider value={{ setToastOpen, toastMessage, setToastMessage }}>
        {posts.map((post, i) => {
          const { _id } = post;
          return <Post key={_id} {...post} setPost={setPost(i)} postComeFirst={() => postComeFirst(i)} />
        })}
      </ToastContext.Provider>
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        message={toastMessage}
      />
    </div >
  )
}

export default Posts;