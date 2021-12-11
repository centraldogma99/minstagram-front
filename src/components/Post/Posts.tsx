import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
const backServer = process.env.REACT_APP_backServer;
import { IPost } from "../../types/postTypes"
import Post from "./Post";
import { css } from "@emotion/css"
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import PostsContext from "../../context/PostsContext";
import _ from "lodash"
import { useContext } from "react";
import AuthContext from "../../context/authContext";

const ReverseButton = css`
  position: fixed;
  bottom: 50px;
  right: 50px;
  cursor: pointer;
`

export const PostsStyle = css`
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100% - 4em);
  justify-content: center;
  padding-top: 4em;
`

interface PostsRes {
  totalPosts: number,
  totalPages: number,
  currentPage: number,
  pageSize: number,
  data: IPost[]
}

const PAGE_SIZE = 5;

// post를 서버에서 가져오고 저장
const Posts = (props: { posts?: IPost[], postIds?: string[] }) => {
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState<IPost[]>(props.posts ?? []);
  const [isReverse, setIsReverse] = useState(false);
  const [topPost, setTopPost] = useState<number>();

  const [isFetching, setIsFetching] = useState<boolean>(true);

  // 현재 보고 있는 페이지
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const ref = useRef<any>();

  useEffect(() => {
    if (!props.posts && hasNext && user._id != '') {
      // if(currentPage )
      const f = async () => {
        try {
          const res = await axios.get<PostsRes>(`${backServer}/posts/`,
            { params: { pageSize: PAGE_SIZE, page: currentPage, userId: user._id } }
          )
          if (!res.data.data) {
            setHasNext(false)
            return;
          }
          setPosts(prev => [...prev, ...res.data.data])
        } catch (e: any) {
          // if (e.response && e.response.status === 400) setHasNext(false);
          console.log(e);
        }
        setIsFetching(false);
      }
      f();
    }
  }, [currentPage, hasNext, user])

  // The scroll listener
  const handleScroll = useCallback((e) => {
    const element = e.target;
    const isScrolledToBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (isScrolledToBottom) setCurrentPage(prev => prev + 1)
  }, []);

  // Attach the scroll listener to the div
  useEffect(() => {
    const throttled = _.throttle(handleScroll, 150)
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

  return (
    <div className={PostsStyle} ref={ref}>
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
        {!isFetching && posts.length === 0 &&
          <div>
            표시할 포스트가 없습니다.
          </div>
        }
        {posts.length > 0 && renderPosts()}
      </PostsContext.Provider>
      <FlipCameraAndroidIcon
        className={ReverseButton}
        onClick={() => { setIsReverse(prev => !prev); setTopPost(undefined); }}
      />
    </div >
  )
}

export default Posts;