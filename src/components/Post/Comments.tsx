import React, { useEffect, useState } from "react";
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

const commentsDisplayed = 2;

const Comments = (props: { comments: IComment[], isExpanded: boolean }) => {
  const [comments, setComments] = useState<IComment[]>(props.comments.slice(0, commentsDisplayed + 1));
  const [allComments, setAllComments] = useState<IComment[]>(props.comments);
  const [isExpanded, setIsExpanded] = useState<boolean>(props.isExpanded);

  useEffect(() => {
    setIsExpanded(props.isExpanded);
    setAllComments(props.comments);
    if (props.isExpanded) {
      setComments(allComments)
    }
  }, [props.comments, props.isExpanded])

  const handleClick = () => {
    setIsExpanded(true);
    setComments(allComments)
  }

  const renderComment = (comment: IComment, index: number) => {
    return (
      <div className="comment" key={index}>
        <CommentAuthorName>{comment.authorName}</CommentAuthorName>
        <CommentContent>{comment.content}</CommentContent>
      </div>
    )
  }

  return (
    <div className="comments">
      {comments.map((comment, index) => renderComment(comment, index))}
      {!isExpanded && allComments.length > commentsDisplayed && <>
        <a onClick={handleClick}>댓글 {allComments.length}개 모두 보기</a>
      </>}
    </div>
  )
}

export default Comments;