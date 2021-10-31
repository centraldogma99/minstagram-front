import React, { useState } from "react"
import axios from "axios";
import { backServer } from "../../configs/env";
import { IComment, IPost } from "../../types/postTypes";

const CommentForm = (props: { postId: string, onSubmit: (comment: IComment) => void }) => {
  const [text, setText] = useState<string>("");

  const handleChange = (e: any) => {
    setText(e.target.value);
  }

  // text를 현재 포스트에 등록하고
  // 코멘트 목록 업데이트
  const handleClick = () => {
    axios.post(`${backServer}/posts/${props.postId}/comment`, {
      content: text,
      likes: []
    }, { withCredentials: true }).then((res) => {
      setText("");
      console.log("submitted")
      console.log(res);
      props.onSubmit((res as any).data);
    })
      .catch(e => {
        console.log(e);
      })
  };

  return (
    <div id="commandForm">
      <input type="text" onChange={handleChange} value={text} />
      <input type="button" value="게시" onClick={handleClick} />
    </div>
  )
}

export default CommentForm;