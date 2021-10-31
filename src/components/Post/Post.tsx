import React from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
import Likes from "./Likes"
import Comments from "./Comments"
import CommentForm from "./CommentForm";
import styled from "styled-components";
import { IComment, ILike } from "../../types/postTypes";

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Post = (props: { _id: string, authorId: string, pictures: string[], likes: ILike[], comments: IComment[] }) => {
  const { _id, authorId, pictures } = props;

  // const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState<IComment[]>(props.comments);
  const [likes, setLikes] = React.useState(props.likes);
  const [isCommentsExpanded, setIsCommentsExpanded] = React.useState<boolean>(false);

  const handleCommentSubmit = (comment: IComment) => {
    console.log("hi")
    console.log(comment)
    setComments([...comments, comment]);
    setIsCommentsExpanded(true);
  }

  const handleLike = (like: ILike) => {
    setLikes([...likes, like]);
  };


  return (
    <div className="post" key={_id}>
      <PostTopBar>
        <Profile userId={authorId} />
      </PostTopBar>
      <PicturesView pictures={pictures} />
      {likes.length > 0 && <Likes likes={likes} />}
      {comments.length > 0 && <Comments comments={comments} isExpanded={isCommentsExpanded} />}
      <CommentForm postId={_id} onSubmit={handleCommentSubmit} />
    </div>
  );
}

export default Post;