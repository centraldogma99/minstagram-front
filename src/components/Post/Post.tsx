import React from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
// import Likes from "./Likes"
import Comments from "./Comments"
import styled from "styled-components";
import { IPost } from "../../types/postTypes";
import option from "../../assets/option.svg"
import axios from "axios";
import { backServer } from "../../configs/env";

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostTopBarButton = styled.img`
  width: 1em;
  height: 1em;
`;

const Post = (props: IPost) => {
  const { _id, author, pictures, comments, text } = props;
  // const [likes, setLikes] = React.useState(props.likes);

  // TODO: like button 구현
  // const handleLike = (like: ILike) => {
  //   setLikes([...likes, like]);
  // };

  const handleClick = () => {
    axios.delete(`${backServer}/posts/${_id}`, { withCredentials: true })
  }

  return (
    <div className="post" key={_id}>
      <PostTopBar>
        <Profile user={author} />
        <PostTopBarButton src={option} onClick={handleClick} />
      </PostTopBar>
      <PicturesView pictures={pictures} />
      {/* {likes.length > 0 && <Likes likes={likes} />} */}
      <p>{text && <b>{author.name}</b>} &nbsp; {text}</p>
      <Comments postId={_id} comments={comments} />
    </div>
  );
}

export default Post;