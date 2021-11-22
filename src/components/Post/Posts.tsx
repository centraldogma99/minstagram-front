import axios from "axios";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import { Snackbar } from "@mui/material";
import Post from "./Post";
import ToastContext from "../../context/ToastContext";
import { css } from "@emotion/css"
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import PostsContext from "../../context/PostsContext";

const ReverseButton = css`
  position: fixed;
  bottom: 50px;
  right: 50px;
`

// post를 서버에서 가져오고 저장
const Posts = (props: { posts?: IPost[], postIds?: string[] }) => {
  const [posts, setPosts] = useState<IPost[]>(props.posts ?? []);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isReverse, setIsReverse] = useState(false);
  const [topPost, setTopPost] = useState<number>();

  const renderPosts = () => {
    let ps = posts;
    if (topPost != undefined) {
      ps = [...posts.slice(0, topPost), ...posts.slice(topPost + 1)]
    }
    if (isReverse) {
      ps = [...ps].reverse();
    }
    if (topPost != undefined) {
      ps = [posts[topPost], ...ps]
    }
    return ps.map((post, i) => <Post key={post._id} post={post} order={isReverse ? ps.length - i - 1 : i} />)
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
        <PostsContext.Provider value={{
          deletePost: (i: number) => {
            setPosts(prev => [...prev.slice(0, i), ...prev.slice(i + 1)])
          },
          // 불변성을 훼손하지 않도록.
          editPost: (i: number, text: string) => {
            setPosts(prev =>
              [...prev.slice(0, i),
              { ...prev[i], text: text },
              ...prev.slice(i + 1)])
            setTopPost(i)
          }
        }} >
          {!isFetching && !posts &&
            <div>
              표시할 포스트가 없습니다.
            </div>
          }
          {/* {posts && posts.map((post, i) => {
            const { _id } = post;
            return <Post key={_id} post={post} order={i} />
          })} */}
          {posts && renderPosts()}
          {/* {posts && posts.reverse().map((post, i) => {
          const { _id } = post;
          return <Post key={_id} {...post} setPost={setPost(i)} postComeFirst={() => postComeFirst(i)} />
        })} */}
        </PostsContext.Provider>
      </ToastContext.Provider>
      <FlipCameraAndroidIcon
        className={ReverseButton}
        onClick={() => { setIsReverse(prev => !prev); setTopPost(undefined); }}
      />
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