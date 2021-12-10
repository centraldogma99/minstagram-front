import React, { useState, useContext, useLayoutEffect } from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
// import Likes from "./Likes"
import Comments from "./Comments"
import styled from "styled-components";
import { IPost } from "../../types/postTypes";
import option from "../../assets/option.svg"
import PostMenuModal from "./PostMenuModal";
import getPost from "../../modules/getPost";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/authContext";
import PostContext from "../../context/postContext"
import axios from "axios"
const backServer = process.env.REACT_APP_backServer;
import CommentForm from "./CommentForm";
import { Divider } from "@mui/material";
import { css } from "@emotion/css"
import WrongLink from "../Error/WrongLink";
import PostViewModal from "./PostViewModal";
import dayjs from 'dayjs';
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('ko')

// --- 일반 post style ---

const SPostTopBar = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.6em;
  padding-bottom: 0.6em;
  padding-left: 0.7em;
  padding-right: 0.7em;
`;

const PostTopBarButton = styled.img`
  width: 1em;
  height: 1em;
  cursor: pointer;
`;

const postsTextContainer = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* font-size: 0.9em; */
  padding-left: 0.9em;
  padding-right: 0.9em;
  padding-top: 0.2em;
  overflow: auto;
`

const postTimestamp = css`
  margin-top: 1em;
  margin-bottom: 1.4em;
  font-size: 0.8em;
  text-align: left;
`

// --- 일반 post style 끝 ---

// --- 모달 post style 시작 ---
const postModal = css`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

// 왼쪽 이미지 표시 부분
const picturesViewContainer = css`
  border-right: 1px solid gainsboro;
  flex: 2;
  height: 100%;
`;

const postModalSide = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-width: 35%;
  word-break: break-word;
`;

const SPostTextContainerModal = css`
  text-align: left;
  margin-top: 0.7em;
  margin-bottom: 0.2em;
  font-size: 0.9em;
`;

// --- 모달 post style 끝 ---

const SPostTextContainer = css`
  word-break: break-word;
  text-align: left;
  margin-top: 0.7em;
  margin-bottom: 0.2em;
`;

const SCommentsContainerStyle = css`
  flex: 1;
  height: 100%;
  margin-top: 0.5em;
`

const SCommentsStyle = css`
  font-size: 0.9em;
  padding-bottom: 0.2em;
  /* margin-top: 1em; */
`

const SPostPictures = css`
  max-width: 100%;
  max-height: 100%;
`

const Post = (props: ({ post?: IPost, order?: number, style?: string, isModal?: boolean, commentMenu?: boolean } | Record<string, never>)) => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>();
  const [show, setShow] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const postMenuModal = () =>
    <PostMenuModal
      open={show}
      onClose={() => {
        setShow(false);
      }}
      isAuthor={user._id === post?.author._id}
      width="18em"
    />

  const PostStyle = css`
    /* width: 55%; */
    /* max-height: 45em; */
    max-width: 40em;
    border: solid 0.1em gainsboro;
    margin-bottom: 1em;
    margin-left: auto;
    margin-right: auto;
    ${props.style}
  `

  const handleCommentSubmit = (text: string) => {
    const p = post as IPost
    axios.post(`${backServer}/posts/${p._id}/comment`, {
      content: text,
      likes: []
    }, { withCredentials: true }).then((res: any) => {
      setPost({ ...p, comments: [...p.comments, res.data] })
    })
      .catch(e => {
        console.log(e);
      })
  }

  useLayoutEffect(() => {
    if (props.post) {
      // Posts로부터 렌더링 되었을 때
      setPost(props.post);
      setIsInitialLoad(false);
    } else {
      // <Post /> 로써 렌더링 되었을 때
      // props.setPost가 없을 것이다.
      // 비동기 작업이 있기 때문에 별도의 변수로 작업 종료를 관리해야 한다.
      getPost(postId)
        .then((res: any) => {
          setPost(res.data);
          setIsInitialLoad(false);
        })
        .catch(e => {
          console.log(e.response.status)
          if (e.response.status === 400) {
            setPost(undefined);
          } else {
            console.log(e)
          }
        })
    }
  }, [])

  useLayoutEffect(() => {
    if (props.post) {
      setPost(props.post)
    }
  }, [props.post])

  // TODO: like button 구현
  // const handleLike = (like: ILike) => {
  //   setLikes([...likes, like]);
  // };

  return (
    <>
      {post &&
        <PostContext.Provider value={{
          // post._id가 undefined일 수도 있다.
          post: { ...post, order: props.order },
          setOpen: setOpen
        }} >
          <PostViewModal
            post={post}
            open={open}
            onClose={() => setOpen(false)}
          />
          {
            !isInitialLoad && !post.isDeleted && !props.isModal &&
            <div className={PostStyle}>
              {postMenuModal()}
              <div className={SPostTopBar}>
                <Profile user={post.author} />
                <PostTopBarButton src={option} onClick={() => setShow(true)} />
              </div>
              <Divider />
              <PicturesView
                pictures={post.pictures}
                style={SPostPictures}
                containerStyle={postId ? css`height: 40em;` : css`min-height: 20em; max-height: 40em;`}
                sizeCalc={true}
              />

              {/* {likes.length > 0 && <Likes likes={likes} />} */}
              <div className={postsTextContainer}>
                <div className={SPostTextContainer}>
                  <span className={css`font-weight: bold; margin-right: 1em;`}>{post.author.name}</span>{post.text}
                </div>
                <div className={postTimestamp}>
                  {dayjs(new Date(post.timestamp)).fromNow()}
                </div>

                <Comments
                  comments={post.comments}
                  isExpanded={false}
                  style={SCommentsStyle}
                  menu={props.commentMenu}
                />
              </div>

              <Divider />
              <CommentForm onSubmit={handleCommentSubmit} />
            </div >
          }

          {/*-----모달 버전 포스트 뷰 -----*/}
          {
            !isInitialLoad && !post.isDeleted && props.isModal &&
            <div className={postModal}>
              {postMenuModal()}
              <PicturesView
                pictures={post.pictures}
                containerStyle={picturesViewContainer}
                style={css`max-width: 100%; max-height: 100%;`}
              />

              <div className={postModalSide}>
                <div className={SPostTopBar}>
                  <Profile user={post.author} />
                  <PostTopBarButton src={option} onClick={() => setShow(true)} />
                </div>
                <Divider />
                <div className={postsTextContainer}>
                  <div className={SPostTextContainerModal}>
                    <span className={css`font-weight: bold; margin-right: 1em;`}>{post.author.name}</span>{post.text}
                  </div>
                  <div className={postTimestamp}>
                    {dayjs(new Date(post.timestamp)).fromNow()}
                  </div>

                  <Comments
                    comments={post.comments}
                    isExpanded={true}
                    style={SCommentsStyle}
                    containerStyle={SCommentsContainerStyle}
                    timestamp={true}
                    menu={true}
                  />
                </div>
                <div>
                  <Divider />
                  <CommentForm onSubmit={handleCommentSubmit} />
                </div>
              </div>
            </div>
          }
          {/* {post.isDeleted && <>
        <div className="deleted-post">
          Whoooo! Deleted Post!
        </div>
      </>} */}
        </PostContext.Provider >
      }
      {(!isInitialLoad && !post) && <WrongLink />}
    </>
  );
}

export default Post;