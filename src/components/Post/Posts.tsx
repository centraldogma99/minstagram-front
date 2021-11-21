import axios from "axios";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import { Snackbar } from "@mui/material";
import Post from "./Post";
import ToastContext from "../../context/ToastContext";

// post를 서버에서 가져오고 저장
const Posts = (props: { posts?: IPost[], postIds?: string[] }) => {
  const [posts, setPosts] = useState<IPost[]>(props.posts ?? []);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const setPost = (i: number) => {
    return (newPost: IPost) => {
      setPosts([...posts.slice(0, i), newPost, ...posts.slice(i + 1)])
    }
  }

  // useEffect(() => {
  //   const orderPosts = () => {
  //     setPosts(posts.reverse())
  //   }
  //   orderPosts();
  // }, [])

  const postComeFirst = (i: number) => {
    setPosts([posts[i], ...posts.slice(0, i), ...posts.slice(i + 1)])
  }

  // 이 컴포넌트가 posts prop 없이 호출될 경우
  // 백엔드에서 포스트 요청하기
  useLayoutEffect(() => {
    if (posts.length === 0) {
      axios.get(`${backServer}/posts/`, { params: { pageSize: 50 } })
        .then(res => {
          setPosts(res.data as IPost[]);
          setIsFetching(false);
        })
        .catch(e => console.log(e))
    } else {
      setIsFetching(false);
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
        {!isFetching && !posts &&
          <div>
            표시할 포스트가 없습니다.
          </div>
        }
        {posts && posts.map((post, i) => {
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