import React, { useState } from "react"
import axios from "axios"
import { backServer } from "../../configs/env"
import { useHistory, useLocation, useParams } from "react-router-dom"

const EditPost = () => {
  const textProp = useLocation<{ text: string }>().state.text;
  const history = useHistory();
  const { postId } = useParams<{ postId: string }>();
  // FIXME param URL로 변경시....
  const [text, setText] = useState<string>(textProp)

  const handleSubmit = async () => {
    await axios.post(`${backServer}/posts/${postId}/edit`, { text }, { withCredentials: true })
    history.push('/')
  }

  return (
    <div id="editPost">
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <input type="button" onClick={handleSubmit} />
    </div>
  )
}

export default EditPost