// 사진을 입력받아 새로운 post 생성

import React, { useState } from "react";
import axios from "axios"
import { backServer } from "../../configs/env";

// TODO: 이미지 미리보기 어떤 식으로 지원할지?
// TODO: 이미지 비율 안바뀌도록 조정하기
// TODO: UI
const NewPost = () => {
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [text, setText] = useState<string>("");

  const handleClick = () => {
    const formData = new FormData();
    if (pictures !== null) {
      for (let i = 0; i < pictures.length; i++) {
        formData.append("pictures", pictures[i]);
      }
    }
    formData.append("text", text);

    axios.post(`${backServer}/posts/new`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log(res);
      });
  };


  return (
    <div id="newPost">
      <input type="file" multiple onChange={(e) => setPictures(e.target.files)} accept="image/png, image/jpeg" />
      <br />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <input type="button" value="새 글 작성" onClick={handleClick} />
      <br />
      {pictures && pictures.length > 0 &&
        Array.from(pictures).map((picture, index) => (
          <img key={index} src={URL.createObjectURL(picture)} width="100em" height="100em" />
        ))
      }
    </div>
  );
};

export default NewPost;