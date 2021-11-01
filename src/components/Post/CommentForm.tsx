import React, { useState } from "react"

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
    <div id="commandForm">
      <input type="text" onChange={handleChange} value={text} />
      <input type="button" value="게시" onClick={handleClick} />
    </div>
  )
}

export default CommentForm;