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
import PicturesView from '../Post/PicturesView';
import TextEditorWithLength from '../TextEditorWithLength/TextEditorWithLength';
import { useEffect } from 'react';

const TEXT_MAX_LENGTH = 100;

const Input = styled.input`
  display: none;
`

const NewPostContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

const NewPostContentPictures = css`
  min-width: 20em;
`

const messageStyle = css`
  font-size: 1.2em;
  margin-bottom: 1em;
  font-weight: 100;
`

const PicturesPreviewContainer = css`
  display: flex;
  flex-direction: row;
  height: 100%;
`

const PicturesPreviewTextEditorContainer = css`
  width: 25em;
  border-left: 1px solid gainsboro;
`

const PicturesPreviewTextEditor = css`
  border: 0;
  outline: none;
  resize: none;
  font-family: inherit;
  margin: 0.5em;
  width: 93%;
`

const ErrorText = css`
  font-weight: bold;
  margin-top: 1.2em;
  padding: 0.5em;
  font-size: 0.8em;
  color: red;
`

const NewPostModal = (props: { open: boolean, onClose: () => void }) => {
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [text, setText] = useState<string>("");
  const { user } = useContext(AuthContext);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const initialize = () => {
    setText("");
    setPictures(null);
    setIsUploaded(false);
  }

  const NewPostContentContainer = css`
    position: relative;
    height: ${!pictures || isUploaded ? "25em" : "none"};
  `

  useEffect(() => {
    if (errorText.length > 0 && text.length > 0)
      setErrorText("");
  }, [text])

  const handleClick = () => {
    console.log(text);
    const formData = new FormData();
    if (pictures !== null) {
      for (let i = 0; i < pictures.length; i++) {
        formData.append("pictures", pictures[i]);
      }
    }
    if (!text) {
      setErrorText("! 문구를 입력해 주세요.")
      return;
    } else {
      formData.append("text", text);
    }


    axios.post(`${backServer} /posts/new`, formData, {
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
      width={pictures && !isUploaded ? "none" : undefined}
      next={pictures && !isUploaded ? { text: '공유하기', onClick: handleClick } : undefined}
    >
      {!isUploaded &&
        <div className={NewPostContentContainer}>
          {!pictures &&
            <NewPostContent>
              <p className={messageStyle}>업로드할 사진을 선택하세요.</p>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file"
                  onChange={(e) => setPictures(e.target.files)} />
                <Button variant="contained" component="span">
                  컴퓨터에서 선택
                </Button>
              </label>
            </NewPostContent>
          }
          {pictures && pictures.length > 0 &&
            <div className={PicturesPreviewContainer}>
              <div className={NewPostContentPictures}>
                <PicturesView
                  pictures={Array.from(pictures).map((picture) => {
                    return URL.createObjectURL(picture)
                  })}
                  isURL={true} />
              </div>
              <div className={PicturesPreviewTextEditorContainer}>
                <div style={{ margin: "0.5em" }}>
                  <Profile user={user} />
                </div>
                <TextEditorWithLength
                  height="19em"
                  textMaxLength={500}
                  fontSize="0.8em"
                  setText={setText}
                >
                  <textarea
                    className={PicturesPreviewTextEditor}
                    placeholder={"문구 입력..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </TextEditorWithLength>

                {errorText &&
                  <>
                    <Divider />
                    <div className={ErrorText}>
                      {errorText}
                    </div>
                  </>}
              </div>
            </div>
          }
        </div>}
      {isUploaded &&
        <div className={NewPostContentContainer}>
          <NewPostContent>
            <img src="https://www.instagram.com/static/images/creation/30fpsCheckLoopsOnce.gif/10a8cbeb94ba.gif" />
            <p className={messageStyle}>게시물이 공유되었습니다.</p>
          </NewPostContent>
        </div>}
    </MinstagramModal >
  )
}

export default NewPostModal;