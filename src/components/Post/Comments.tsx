import React from "react";
import styled from "styled-components";
import { IComment } from "../../types/postTypes";

const CommentAuthorName = styled.span`
  display: inline-block;
  width: 80px;
  font-size: 15px;
  font-weight: bold;
`;

const CommentContent = styled.span`
  font-size: 15px;
`;

const Comments = (props: { comments: IComment[] }) => {
  const renderComment = (comment: IComment) => {
    return (
      <div className="comment">
        <CommentAuthorName>{comment.authorName}</CommentAuthorName>
        <CommentContent>{comment.content}</CommentContent>
      </div>
    )
  }

  return (
    <div className="comments">
      {props.comments.map(comment => renderComment(comment))}
    </div>
  )
}

export default Comments;