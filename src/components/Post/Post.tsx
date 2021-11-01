import React from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
// import Likes from "./Likes"
import Comments from "./Comments"
import styled from "styled-components";
import { IComment, ILike, IUser } from "../../types/postTypes";

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Post = (props: { _id: string, author: IUser, pictures: string[], likes: ILike[], comments: IComment[] }) => {
  const { _id, author, pictures, comments } = props;
  // const [likes, setLikes] = React.useState(props.likes);

  // TODO: like button 구현
  // const handleLike = (like: ILike) => {
  //   setLikes([...likes, like]);
  // };


  return (
    <div className="post" key={_id}>
      <PostTopBar>
        <Profile user={author} />
      </PostTopBar>
      <PicturesView pictures={pictures} />
      {/* {likes.length > 0 && <Likes likes={likes} />} */}
      <Comments postId={_id} comments={comments} />
    </div>
  );
}

export default Post;