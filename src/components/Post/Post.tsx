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

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  padding: 0,
};

const Post = (props: IPost | Record<string, never>) => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [show, setShow] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    if ('_id' in props) {
      setPost(props as IPost);
      setIsInitialLoad(false);
    } else {
      // 비동기 작업이 있기 때문에 별도의 변수로 작업 종료를 관리해야 한다.
      getPost(postId)
        .then((res: any) => {
          setPost(res.data);
          setIsInitialLoad(false);
        })
    }
  }, [])


  // const { _id, author, pictures, comments, text } = post as IPost;

  // const [likes, setLikes] = React.useState(props.likes);

  // TODO: like button 구현
  // const handleLike = (like: ILike) => {
  //   setLikes([...likes, like]);
  // };

  const handleClick = (setState: (v: boolean) => void) => { return () => setState(true) };
  const handleClose = (setState: (v: boolean) => void) => { return () => setState(false) };
  if (!isInitialLoad) {
    console.log(user._id)
    console.log(post.author._id)
    console.log(post)
  }

  return (
    <>
      {!isInitialLoad &&
        <div className="post" key={post._id}>
          <PostMenuModal
            open={show}
            onClose={handleClose(setShow)}
            _id={post._id}
            text={post.text ?? ""}
            isAuthor={user._id === post.author._id}
          />
          <PostTopBar>
            <Profile user={post.author} />
            {/* <PostMenu /> */}
            <PostTopBarButton src={option} onClick={handleClick(setShow)} />

          </PostTopBar>
          <PicturesView pictures={post.pictures} />
          {/* {likes.length > 0 && <Likes likes={likes} />} */}

          <p>{post.text && <b>{post.author.name}</b>} &nbsp; {post.text}</p>
          <Comments postId={post._id} comments={post.comments} />
        </div >}
    </>

  );
}

export default Post;