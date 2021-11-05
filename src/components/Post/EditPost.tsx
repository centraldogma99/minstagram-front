import React, { useState } from "react"
import axios from "axios"
import { backServer } from "../../configs/env"
import { useLocation, useParams } from "react-router-dom"

const EditPost = () => {
  const textProp = useLocation<{ text: string }>().state.text;
  const { postId } = useParams<{ postId: string }>();
  const [text, setText] = useState<string>(textProp)
  const handleSubmit = () => {
    axios.post(`${backServer}/posts/${postId}/edit`, { text }, { withCredentials: true })
  }

  return (
    <div id="editPost">
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <input type="button" onClick={handleSubmit} />
    </div>
  )
}

export default EditPost