import React, { useState } from 'react'
import MinstagramModal from './MinstagramModal';
import { Button, Divider } from '@mui/material';
import styled from "@emotion/styled"
import { css } from "@emotion/css"
import Profile from '../Profile';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import { backServer } from '../../configs/env';
import axios from 'axios';

const Input = styled.input`
  display: none;
`

const NewPostContentContainer = styled.div`
  position: relative;
  height: 25em;
`

const NewPostContent = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -60%);
  text-align: center;
`

const NewPostContentPictures = css`
  width: 65%;
  height: 100%;
`

const messageStyle = css`
  font-size: 1.1em;
  margin-bottom: 1em;
`

const PicturesPreviewContainer = css`
  display: flex;
  flex-direction: row;
  height: 100%;
`

const PicturesPreviewTextEditorContainer = css`
  width: 35%;
  border: 1px solid gainsboro;
  border-top: none;
`

const PicturesPreviewTextEditor = css`
  width: 95%;
  height: 60%;
  border: 0;
  outline: none;
  resize: none;
  font-family: inherit;
  margin: 0.5em;
`

const NewPostModal = (props: { open: boolean, onClose: () => void }) => {
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [text, setText] = useState<string>("");
  const { user } = useContext(AuthContext);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const initialize = () => {
    setText("");
    setPictures(null);
    setIsUploaded(false);
  }

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
        setIsUploaded(true);
      });
  };

  return (
    <MinstagramModal
      open={props.open}
      onClose={() => { initialize(); props.onClose(); }}
      title={isUploaded ? "게시물이 공유되었습니다" : "새 게시물 만들기"}
      width={pictures && !isUploaded ? "42em" : undefined}
      next={pictures && !isUploaded ? { text: '공유하기', onClick: handleClick } : undefined}
    >
      {!isUploaded &&
        <NewPostContentContainer>
          {!pictures &&
            <NewPostContent>
              <p className={messageStyle}>업로드할 사진을 선택하세요.</p>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file"
                  onChange={(e) => setPictures(e.target.files)} />
                <Button variant="contained" component="span">
                  업로드
                </Button>
              </label>
            </NewPostContent>
          }
          {pictures && pictures.length > 0 &&
            <div className={PicturesPreviewContainer}>
              <div className={NewPostContentPictures}>
                {Array.from(pictures).map((picture, index) => (
                  <img key={index} src={URL.createObjectURL(picture)} width="100em" height="100em" />
                ))}
              </div>
              <div className={PicturesPreviewTextEditorContainer}>
                <div style={{ margin: "0.5em" }}>
                  <Profile user={user} />
                </div>
                <textarea className={PicturesPreviewTextEditor} placeholder={"문구 입력..."} onChange={(e) => { setText(e.target.value) }} />
                <Divider />
              </div>
            </div>
          }
        </NewPostContentContainer>}
      {isUploaded && <NewPostContentContainer>
        <NewPostContentContainer>
          <NewPostContent>
            <img src="https://www.instagram.com/static/images/creation/30fpsCheckLoopsOnce.gif/10a8cbeb94ba.gif" />
            <p className={messageStyle}>게시물이 공유되었습니다.</p>
          </NewPostContent>
        </NewPostContentContainer>
      </NewPostContentContainer>}
    </MinstagramModal >
  )
}

export default NewPostModal;