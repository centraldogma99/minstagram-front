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

const NewPostContentContainer = styled.div`
  position: relative;
  height: 25em;
`

const NewPostContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

const NewPostContentPictures = css`
  /* position: relative; */
  width: 65%;
  height: 100%;
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
  width: 35%;
  border: 1px solid gainsboro;
  border-top: none;

`

const PicturesPreviewTextEditor = css`
  border: 0;
  outline: none;
  resize: none;
  font-family: inherit;
  margin: 0.5em;
  width: 93%;
  height: 100%;
`

const ErrorText = css`
font-weight: bold;
  margin-top: 1.2em;
  padding: 0.5em;
  font-size: 0.8em;
  color: red;
`

const PicturesViewContainer = css`
  /* width: 100%;
  height: 100%; */
  /* position: absolute;
  top: 50%;
  transform: translateY(-50%); */
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
                  textMaxLength={100}
                  fontSize="0.8em"
                  className={PicturesPreviewTextEditor}
                  // width="93%"
                  // height="60%"
                  placeholder={"문구 입력..."}
                  setText={setText}
                />
                <Divider />
                <div className={ErrorText}>
                  {errorText}
                </div>

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