import React from "react";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
import Likes from "./Likes"
import Comments from "./Comments"
import CommentForm from "./CommentForm";
import styled from "styled-components";
import { IComment, ILike, IUser } from "../../types/postTypes";

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Post = (props: { _id: string, author: IUser, pictures: string[], likes: ILike[], comments: IComment[] }) => {
  const { _id, author, pictures } = props;

  // const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState<IComment[]>(props.comments);
  const [likes, setLikes] = React.useState(props.likes);
  const [isCommentsExpanded, setIsCommentsExpanded] = React.useState<boolean>(false);

  // 코멘트를 등록하고, 확장하기(CommentsForm에 전달되는 함수)
  const handleCommentSubmit = (comment: IComment) => {
    setComments([...comments, comment]);
    if (!isCommentsExpanded) setIsCommentsExpanded(true);
  }

  // TODO: like button 구현
  const handleLike = (like: ILike) => {
    setLikes([...likes, like]);
  };


  return (
    <div className="post" key={_id}>
      <PostTopBar>
        <Profile user={author} />
      </PostTopBar>
      <PicturesView pictures={pictures} />
      {likes.length > 0 && <Likes likes={likes} />}
      <Comments postId={_id} comments={comments} isExpanded={isCommentsExpanded} />
    </div>
  );
}

export default Post;