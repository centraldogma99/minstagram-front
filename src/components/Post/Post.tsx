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
import { Divider, Snackbar } from "@mui/material";
import { css } from "@emotion/css"
import ToastContext from "../../context/ToastContext";

const commentsDisplayed = 2;

const PostTopBar = styled.div`
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

const postTextContainer = css`
  margin-top: 0.7em;
  padding-left: 0.7em;
  padding-right: 0.7em;
  margin-bottom: 0.2em;
`

interface PostsProps {
  setPost: (post: IPost) => void,
  postComeFirst: () => void
}


const Post = (props: (IPost & PostsProps | Record<string, never>)) => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [show, setShow] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const { user } = useContext(AuthContext);
  const [isCommentExpanded, setIsCommentExpanded] = useState<boolean>(false);
  const { setToastOpen, toastMessage, setToastMessage } = useContext(ToastContext);

  const handleToastClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setToastOpen(false);
  };

  const handleCommentSubmit = (text: string) => {
    axios.post(`${backServer}/posts/${post._id}/comment`, {
      content: text,
      likes: []
    }, { withCredentials: true }).then((res: any) => {
      if (post.comments.length === commentsDisplayed) setIsCommentExpanded(true);
      setPost(prev => {
        const { comments, ...rest } = prev;
        return { comments: [...comments, res.data], ...rest };
      })
    })
      .catch(e => {
        console.log(e);
      })
  }

  useLayoutEffect(() => {
    if ('_id' in props) {
      // Posts로부터 렌더링 되었을 때
      const { setPost: s, ...p } = props;
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
        const { isDeleted: i, ...rest } = post;
        setPost({ isDeleted: true, ...rest });
        props.setPost && props.setPost({ isDeleted: true, ...rest })
        props.postComeFirst()
      },
      editPost: (text: string) => {
        const { text: t, ...rest } = post;
        setPost({ text: text, ...rest })
        props.setPost && props.setPost({ text: text, ...rest })
        props.postComeFirst()
      }
    }} >
      {!isInitialLoad && !post.isDeleted &&
        <div className="post" key={post._id}>
          <div className="postContent">
            <PostMenuModal
              open={show}
              onClose={() => {
                setShow(false);
                console.log('postmenumodal closed')
              }}
              isAuthor={user._id === post.author._id}
              width="18em"
            />
            <PostTopBar>
              {/* FIXME: use context */}
              <Profile user={post.author} />
              {/* <PostMenu /> */}
              <PostTopBarButton src={option} onClick={() => { console.log("clicked"); setShow(true) }} />
            </PostTopBar>
            <Divider />
            <PicturesView pictures={post.pictures} />
            {/* {likes.length > 0 && <Likes likes={likes} />} */}
            {post.text && <div className={postTextContainer}>
              <b>{post.author.name}</b> &nbsp; {post.text}
            </div>}

            <Comments comments={post.comments} isExpanded={isCommentExpanded} />
          </div>

          <Divider />
          <CommentForm onSubmit={handleCommentSubmit} />
        </div >
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