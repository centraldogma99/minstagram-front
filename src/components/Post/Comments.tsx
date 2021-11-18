import React, { useEffect, useState } from "react";
import { IComment } from "../../types/postTypes";
import { css } from "@emotion/css"
import Comment from "./Comment";

const moreComment = css`
  color: darkgray;
`
const commentsDisplayed = 2;

const Comments = (props: { comments: IComment[], isExpanded: boolean, style?: string }) => {
  const { comments } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(props.isExpanded);

  // 처음 로드됐을 때, 댓글이 3개 이상이면 더 보기로 표시
  // 댓글이 추가되어 2개에서 3개로 된다면 더 보기로 표시하지 않고 바로 표시
  useEffect(() => {
    setIsExpanded(props.isExpanded)
  }, [props.isExpanded])

  // 더 보기 클릭했을 때의 동작.
  const handleClick = () => {
    setIsExpanded(true);
  }
  // 백엔드에 코멘트 등록 및 프론트엔드 컴포넌트 업데이트

  // 댓글의 개수가 2개 초과이면 2개까지만 보여주고 더 보기를 누르면 모든 댓글을 보여줌.
  return (
    <div>
      <div className="comments">
        {!isExpanded && comments.length > 0 &&
          comments.slice(0, commentsDisplayed).map((comment, index) => <Comment comment={comment} key={index} index={index} />)
        }
        {isExpanded && comments.length > 0 &&
          comments.map((comment, index) => <Comment comment={comment} key={index} index={index} />)
        }
        {!isExpanded && comments.length > commentsDisplayed && <>
          <a onClick={handleClick} className={moreComment}>댓글 {comments.length}개 모두 보기</a>
        </>}
      </div>
    </div>
  )
}

export default Comments;