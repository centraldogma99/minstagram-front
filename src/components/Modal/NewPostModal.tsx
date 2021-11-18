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
import { IPost } from '../../types/postTypes';

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
  border-left: 1px solid gainsboro;
`

const PicturesPreviewTextEditor = css`
  margin: 0;
  padding: 7px;
  border: 0;
  outline: none;
  resize: none;
  font-family: inherit;
  width: 95%;
  height: 100%;
`

const ErrorText = css`
  font-weight: bold;
  margin-top: 1.2em;
  padding: 0.5em;
  font-size: 0.8em;
  color: red;
`

const NewPostModal = (props: { open: boolean, onClose: () => void, originalPost?: IPost }) => {
  const { originalPost } = props;
  const [pictures, setPictures] = useState<FileList | string[] | null>(
    originalPost ? originalPost.pictures : null
  );
  const [text, setText] = useState<string>(originalPost ? originalPost.text : "");
  const { user } = useContext(AuthContext);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const initialize = () => {
    setText("");
    setPictures(null);
    setIsUploaded(false);
  }

  const NewPostContentContainer = css`
    /* position: relative; */
    height: ${(!pictures || isUploaded) ? "25em" : "100%"};
  `

  useEffect(() => {
    if (errorText.length > 0 && text.length > 0)
      setErrorText("");
  }, [text])

  const handleClick = () => {
    if (!text) {
      setErrorText("! 문구를 입력해 주세요.")
      return;
    }

    if (!originalPost) {
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
        .then(() => {
          setIsUploaded(true);
        });
    } else {
      axios.post(`${backServer}/posts/${originalPost._id}/edit`, { text }, { withCredentials: true })
        .then(() => setIsUploaded(true))
    }
  };

  return (
    <MinstagramModal
      open={props.open}
      onClose={() => { initialize(); props.onClose(); }}
      title={isUploaded ?
        (originalPost ? "게시물이 수정되었습니다" : "게시물이 공유되었습니다") :
        (originalPost ? "게시물 수정하기" : "새 게시물 만들기")
      }
      width={pictures && !isUploaded ? "75%" : "30em"}
      height={pictures && !isUploaded ? "80%" : "30em"}
      next={pictures && !isUploaded ?
        { text: (originalPost ? '수정하기' : '공유하기'), onClick: handleClick } :
        undefined}
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
              <PicturesView
                pictures={!originalPost ?
                  Array.from(pictures as FileList).map((picture) => {
                    return URL.createObjectURL(picture)
                  }) :
                  originalPost.pictures
                }
                isURL={!originalPost}
                containerStyle={css`width: 65%;`}
                style={css`max-width: 100%; max-height: 100%;`}
              />
              <div className={PicturesPreviewTextEditorContainer}>
                <div style={{ margin: "0.5em" }}>
                  <Profile user={user} />
                </div>
                <TextEditorWithLength
                  style={css`
                    height: 19em;
                    font-size: 0.8em;
                  `}
                  textMaxLength={500}
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