import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IComment } from "../../types/postTypes";
import CommentForm from "./CommentForm";
import axios from 'axios'
import { backServer } from "../../configs/env";

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

const Comments = (props: { postId: string, comments: IComment[], isExpanded: boolean }) => {
  const [comments, setComments] = useState<IComment[]>(props.comments);
  const [isExpanded, setIsExpanded] = useState<boolean>(props.isExpanded);

  // 처음 로드됐을 때, 댓글이 3개 이상이면 더 보기로 표시
  // 댓글이 추가되어 2개에서 3개로 된다면 더 보기로 표시하지 않고 바로 표시

  // 상위 컴포넌트 Post에서 props 변경 시
  useEffect(() => {
    setIsExpanded(props.isExpanded);
    setComments(props.comments);
  }, [props.comments, props.isExpanded])

  // useEffect(() => {

  // }, [comments])

  // 더 보기 클릭했을 때의 동작.
  const handleClick = () => {
    setIsExpanded(true);
  }

  // 백엔드에 코멘트 등록 및 프론트엔드 컴포넌트 업데이트
  const handleSubmit = (text: string) => {
    axios.post(`${backServer}/posts/${props.postId}/comment`, {
      content: text,
      likes: []
    }, { withCredentials: true }).then((res: any) => {
      if (comments.length === commentsDisplayed) setIsExpanded(true);
      setComments([...comments, res.data])
    })
      .catch(e => {
        console.log(e);
      })
  }

  const renderComment = (comment: IComment, index: number) => {
    return (
      <div className="comment" key={index}>
        <CommentAuthorName>{comment.author.name}</CommentAuthorName>
        <CommentContent>{comment.content}</CommentContent>
      </div>
    )
  }

  // 댓글의 개수가 2개 초과이면 2개까지만 보여주고 더 보기를 누르면 모든 댓글을 보여줌.
  return (
    <>
      <div className="comments">
        {!isExpanded && comments.length > 0 && comments.slice(0, commentsDisplayed).map((comment, index) => renderComment(comment, index))}
        {isExpanded && comments.length > 0 && comments.map((comment, index) => renderComment(comment, index))}
        {!isExpanded && comments.length > commentsDisplayed && <>
          <a onClick={handleClick}>댓글 {comments.length}개 모두 보기</a>
        </>}
      </div>
      <CommentForm onSubmit={handleSubmit} />
    </>
  )
}

export default Comments;