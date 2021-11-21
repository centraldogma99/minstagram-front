import React, { useState, useContext, useLayoutEffect } from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
// import Likes from "./Likes"
import Comments from "./Comments"
import styled from "styled-components";
import { IPost } from "../../types/postTypes";
import option from "../../assets/option.svg"
import PostMenuModal from "../Modal/PostMenuModal";
import getPost from "../../modules/getPost";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/authContext";
import PostContext from "../../context/postContext"
import axios from "axios"
import { backServer } from "../../configs/env";
import CommentForm from "./CommentForm";
import { Divider } from "@mui/material";
import { css } from "@emotion/css"

const commentsDisplayed = 2;

// --- 일반 post style ---
const postContent = css`
  padding-bottom: 0.3em;
  text-align: left;
  font-size: 0.9em;
`

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
`;

// --- 일반 post style 끝 ---

// --- 모달 post style 시작 ---
const postModal = css`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const picturesViewContainer = css`
  border-right: 1px solid gainsboro;
  width: 65%;
  height: 100%;
`;

const postModalSide = css`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 35%;
  /* flex-shrink: 2; */
`;

const postModalSideTop = css`
  border-bottom: 1px solid gainsboro;
`

// --- 모달 post style 끝 ---

const SPostTextContainer = css`
  text-align: left;
  margin-top: 0.7em;
  padding-left: 0.7em;
  padding-right: 0.7em;
  margin-bottom: 0.2em;
  font-size: 0.9em;
`;

const SCommentsStyle = css`
  font-size: 0.9em;
  /* margin-top: 1em; */
`

const SPostPictures = css`
  max-width: 100%;
  max-height: 40em;
`

interface PostsProps {
  setPost?: (post: IPost) => void,
  postComeFirst?: () => void
}


const Post = (props: (IPost & PostsProps & { style?: string, isModal?: boolean } | Record<string, never>)) => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [show, setShow] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const { user } = useContext(AuthContext);
  const [isCommentExpanded, setIsCommentExpanded] = useState<boolean>(false);

  const postMenuModal = () =>
    <PostMenuModal
      open={show}
      onClose={() => {
        setShow(false);
      }}
      isAuthor={user._id === post.author._id}
      width="18em"
    />

  const PostStyle = css`
    width: 55%;
    max-width: 40em;
    border: solid 0.1em gainsboro;
    margin-bottom: 1em;
    ${props.style}
  `

  const handleCommentSubmit = (text: string) => {
    axios.post(`${backServer}/posts/${post._id}/comment`, {
      content: text,
      likes: []
    }, { withCredentials: true }).then((res: any) => {
      if (post.comments.length === commentsDisplayed) setIsCommentExpanded(true);
      setPost({ ...post, comments: [...post.comments, res.data] })
    })
      .catch(e => {
        console.log(e);
      })
  }

  useLayoutEffect(() => {
    if ('_id' in props) {
      // Posts로부터 렌더링 되었을 때
      const { setPost: s, postComeFirst: t, ...p } = props;
      setPost(p as IPost);
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
    }
  }, [])

  // TODO: like button 구현
  // const handleLike = (like: ILike) => {
  //   setLikes([...likes, like]);
  // };

  return (
    <PostContext.Provider value={{
      // post._id가 undefined일 수도 있다.
      post: post,
      deletePost: () => {
        if (props.setPost && props.postComeFirst) {
          setPost({ ...post, isDeleted: true });
          props.setPost({ ...post, isDeleted: true })
          props.postComeFirst()
        }
      },
      editPost: (text: string) => {
        if (props.setPost && props.postComeFirst) {
          setPost({ ...post, text: text })
          props.setPost({ ...post, text: text })
          props.postComeFirst()
        }
      }
    }} >
      {
        !isInitialLoad && !post.isDeleted && !props.isModal &&
        <div className={PostStyle} key={post._id}>
          {postMenuModal()}
          <div className={SPostTopBar}>
            <Profile user={post.author} />
            <PostTopBarButton src={option} onClick={() => setShow(true)} />
          </div>
          <Divider />
          <PicturesView
            pictures={post.pictures}
            style={SPostPictures}
            containerStyle={css`min-height: 15em;`}
            sizeCalc={true}
          />

          {/* {likes.length > 0 && <Likes likes={likes} />} */}
          {post.text &&
            <div className={SPostTextContainer}>
              <b>{post.author.name}</b> &nbsp; {post.text}
            </div>
          }

          <Comments
            comments={post.comments}
            isExpanded={isCommentExpanded}
            style={SCommentsStyle}
          />

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
            <div className={postModalSideTop}>
              <div className={SPostTopBar}>
                {/* FIXME: use context */}
                <Profile user={post.author} />
                {/* <PostMenu /> */}
                <PostTopBarButton src={option} onClick={() => setShow(true)} />
              </div>
              <Divider />
              {post.text && <div className={SPostTextContainer}>
                <b>{post.author.name}</b> &nbsp; {post.text}
              </div>}

              <Comments
                comments={post.comments}
                isExpanded={isCommentExpanded}
                style={SCommentsStyle}
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
  );
}

export default Post;