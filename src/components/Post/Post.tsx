import React from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
// import Likes from "./Likes"
import Comments from "./Comments"
import styled from "styled-components";
import { IPost } from "../../types/postTypes";
import option from "../../assets/option.svg"
import PostMenuModal from "../Modal/PostMenuModal";
import getPost from "../../modules/getPost";
import { useEffect, useLayoutEffect } from "react";
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/authContext";
import PostContext from "../../context/postContext"

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.6em;
  padding-bottom: 0.6em;
`;

const PostTopBarButton = styled.img`
  width: 1em;
  height: 1em;
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  padding: 0,
};

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

  const handleClick = (setState: (v: boolean) => void) => { return () => setState(true) };
  const handleClose = (setState: (v: boolean) => void) => { return () => setState(false) };

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
          <PostMenuModal
            open={show}
            onClose={handleClose(setShow)}
            isAuthor={user._id === post.author._id}
          />
          <PostTopBar>
            {/* FIXME: use context */}
            <Profile user={post.author} />
            {/* <PostMenu /> */}
            <PostTopBarButton src={option} onClick={handleClick(setShow)} />
          </PostTopBar>
          <PicturesView pictures={post.pictures} />
          {/* {likes.length > 0 && <Likes likes={likes} />} */}

          <p>{post.text && <b>{post.author.name}</b>} &nbsp; {post.text}</p>
          <Comments />
        </div >
      }
      {post.isDeleted && <>
        <div className="deleted-post">
          Whoooo! Deleted Post!
        </div>
      </>}
    </PostContext.Provider >

  );
}

export default Post;