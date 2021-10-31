// 사진을 입력받아 profile 사진 변경

import React, { useState } from "react";
import axios from "axios"
import { backServer } from "../../configs/env";

// TODO: 이미지 미리보기 어떤 식으로 지원할지?
// TODO: 이미지 비율 안바뀌도록 조정하기
const ChangeProfile = () => {
  const [picture, setPicture] = useState<FileList | null>(null);

  const handleClick = () => {
    const formData = new FormData();
    if (picture !== null) {
      formData.append("profile-picture", picture[0]);
    }

    axios.post(`${backServer}/users/changeProfile`, formData, {
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
    <div id="changeProfile">
      <input type="file" onChange={(e) => setPicture(e.target.files)} accept="image/png, image/jpeg" />
      <br />
      <input type="button" value="저장" onClick={handleClick} />
      <br />
      {picture && picture.length > 0 &&
        Array.from(picture).map((picture, index) => (
          <img key={index} src={URL.createObjectURL(picture)} width="300em" />
        ))
      }
    </div>
  );
};

export default ChangeProfile;