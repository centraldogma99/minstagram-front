import React, { useState } from "react"
import { css } from "@emotion/css"

const commentForm = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;
  padding: 0.3em;
  /* padding: 0.5em; */
`

const commentInput = css`
  margin-left: 0.4em;
  width: 90%;
  outline: none;
  border: none;
`

const commentInputButton = css`
  width: 2em;
  margin-right: 0.4em;
  color: dodgerblue;
  font-weight: bold;
`

const CommentForm = (props: { onSubmit: (text: string) => void }) => {
  const [text, setText] = useState<string>("");

  const handleChange = (e: any) => {
    setText(e.target.value);
  }

  // text를 현재 포스트에 등록하고
  // 코멘트 목록 업데이트
  const handleClick = () => {
    props.onSubmit(text);
    setText("");
  };

  return (
    <div className={commentForm}>
      <input type="text" onChange={handleChange} value={text} className={commentInput} placeholder="댓글 달기..." />
      <a onClick={handleClick} className={commentInputButton} >게시</a>
    </div >
  )
}

export default CommentForm;