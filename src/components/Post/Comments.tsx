import React, { useEffect, useState, useContext } from "react";
import { IComment } from "../../types/postTypes";
import { css } from "@emotion/css"
import Comment from "./Comment";
import PostContext from "../../context/postContext";

const moreComment = css`
  margin-top: 0.6em;
  color: darkgray;
`

const commentsDisplayed = 2;

const Comments = (props: { comments: IComment[], isExpanded: boolean, style?: string, containerStyle?: string }) => {
  const { comments } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(props.isExpanded);
  const { setOpen } = useContext(PostContext)

  const containerStyle = css`
    text-align: left;
    overflow-y: scroll;
    margin-bottom: 0.5em;
    padding-left: 0.7em;
    padding-right: 0.7em;
    font-size: 0.9em;
    ${props.containerStyle}
  `

  // 처음 로드됐을 때, 댓글이 3개 이상이면 더 보기로 표시
  // 댓글이 추가되어 2개에서 3개로 된다면 더 보기로 표시하지 않고 바로 표시
  useEffect(() => {
    setIsExpanded(props.isExpanded)
  }, [props.isExpanded])

  // 더 보기 클릭했을 때의 동작.
  const handleClick = () => {
    setOpen(true)
    // setIsExpanded(true);
  }
  // 백엔드에 코멘트 등록 및 프론트엔드 컴포넌트 업데이트

  // 댓글의 개수가 2개 초과이면 2개까지만 보여주고 더 보기를 누르면 모든 댓글을 보여줌.
  return (
    <div className={containerStyle}>
      {!isExpanded && comments.length > 0 &&
        comments.slice(comments.length - commentsDisplayed, comments.length).map((comment, index) => <Comment comment={comment} key={index} index={index} style={props.style} />)
      }
      {isExpanded && comments.length > 0 &&
        comments.map((comment, index) => <Comment comment={comment} key={index} index={index} style={props.style} />)
      }
      {!isExpanded && comments.length > commentsDisplayed &&
        <div className={moreComment}>
          <a onClick={handleClick}>댓글 {comments.length}개 모두 보기</a>
        </div>
      }
    </div>
  )
}

export default Comments;