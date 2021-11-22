import axios from "axios";
import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from "react";
import { backServer } from "../../configs/env";
import { IPost } from "../../types/postTypes"
import { Snackbar } from "@mui/material";
import Post from "./Post";
import ToastContext from "../../context/ToastContext";
import { css } from "@emotion/css"
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import PostsContext from "../../context/PostsContext";
import _ from "lodash"

const ReverseButton = css`
  position: fixed;
  bottom: 50px;
  right: 50px;
`

const PAGE_SIZE = 5;

// post를 서버에서 가져오고 저장
const Posts = (props: { posts?: IPost[], postIds?: string[] }) => {
  const [posts, setPosts] = useState<IPost[]>(props.posts ?? []);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isReverse, setIsReverse] = useState(false);
  const [topPost, setTopPost] = useState<number>();

  // 현재 보고 있는 페이지
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const ref = useRef<any>();

  useEffect(() => {
    if (!props.posts && hasNext) {
      // if(currentPage )
      const f = async () => {
        try {
          const res: any = await axios.get(`${backServer}/posts/`, { params: { pageSize: PAGE_SIZE, page: currentPage } })
          setPosts(prev => [...prev, ...(res.data.data as IPost[])])
        } catch (e: any) {
          if (e.response.status === 400) setHasNext(false);
          else console.log(e);
        }
      }
      f();
    }
  }, [currentPage, hasNext])

  // The scroll listener
  const handleScroll = useCallback((e) => {
    const element = e.target;
    const isScrolledToBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (isScrolledToBottom) setCurrentPage(prev => prev + 1)
  }, []);

  // Attach the scroll listener to the div
  useEffect(() => {
    const throttled = _.throttle(handleScroll, 300)
    if (ref.current) {
      ref.current.addEventListener('scroll', throttled)
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', throttled)
      }
    }
  }, [handleScroll, ref.current]);

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
    <div className="posts" ref={ref}>
      <ToastContext.Provider value={{ setToastOpen, toastMessage, setToastMessage }}>
        <PostsContext.Provider value={{
          deletePost: (i: number) => {
            setPosts(prev => [...prev.slice(0, i), ...prev.slice(i + 1)])
          },
          editPost: (i: number, text: string) => {
            setPosts(prev =>
              [...prev.slice(0, i),
              { ...prev[i], text: text },
              ...prev.slice(i + 1)])
            setTopPost(i)
          }
        }} >
          {!posts &&
            <div>
              표시할 포스트가 없습니다.
            </div>
          }
          {posts && renderPosts()}
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