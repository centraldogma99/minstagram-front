import React, { useState, useEffect } from 'react'
import MinstagramModal from '../Modal/MinstagramModal';
import { Button, Divider } from '@mui/material';
import styled from "@emotion/styled"
import { css } from "@emotion/css"
import Profile from '../Profile';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
const backServer = process.env.REACT_APP_backServer;
import axios from 'axios';
import PicturesView from '../Post/PicturesView';
import TextEditorWithLength from '../TextEditorWithLength/TextEditorWithLength';
import { IPost } from '../../types/postTypes';
import PostsContext from '../../context/PostsContext';
import PostContext from '../../context/postContext';

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
  padding: 0.9em;
  border: 0;
  outline: none;
  resize: none;
  font-family: inherit;
  width: 92%;
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const { editPost } = useContext(PostsContext);
  const { post } = useContext(PostContext)

  const initialize = () => {
    setText("");
    setPictures(null);
    setIsUploading(false);
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
      setErrorText("! ????????? ????????? ?????????.")
      return;
    }
    setIsUploading(true);

    upload();
  };

  const upload = async () => {
    if (!originalPost) {
      const formData = new FormData();
      if (pictures !== null) {
        for (let i = 0; i < pictures.length; i++) {
          formData.append("pictures", pictures[i]);
        }
      }
      formData.append("text", text);

      await axios.post(`${backServer}/posts/new`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      await axios.post(`${backServer}/posts/${originalPost._id}/edit`, { text }, { withCredentials: true });

      // refresh frontend contents
      if (post.order != undefined) {
        editPost(post.order, text);
      }
    }
    setIsUploading(false)
    setIsUploaded(true)
  }

  return (
    <MinstagramModal
      open={props.open}
      onClose={() => { initialize(); props.onClose(); }}
      title={isUploaded ?
        (originalPost ? "???????????? ?????????????????????" : "???????????? ?????????????????????") :
        (originalPost ? "????????? ????????????" : "??? ????????? ?????????")
      }
      width={pictures && !isUploaded ? "75%" : "40em"}
      height={pictures && !isUploaded ? "80%" : "40em"}
      next={pictures && !isUploaded ?
        { text: (originalPost ? '????????????' : '????????????'), onClick: handleClick } :
        undefined}
    >
      {
        !isUploaded && isUploading &&
        <div className={NewPostContentContainer}>
          <NewPostContent>
            <p className={messageStyle}>????????? ???...</p>
          </NewPostContent>

        </div>
      }
      {!isUploaded && !isUploading &&
        <div className={NewPostContentContainer}>
          {!pictures &&
            <NewPostContent>
              <p className={messageStyle}>???????????? ????????? ???????????????.</p>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file"
                  onChange={(e) => setPictures(e.target.files)} />
                <Button variant="contained" component="span">
                  ??????????????? ??????
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
                    placeholder={"?????? ??????..."}
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

      {isUploaded && !isUploading &&
        <div className={NewPostContentContainer}>
          <NewPostContent>
            <img src="https://www.instagram.com/static/images/creation/30fpsCheckLoopsOnce.gif/10a8cbeb94ba.gif" />
            <p className={messageStyle}>???????????? ?????????????????????.</p>
          </NewPostContent>
        </div>}
    </MinstagramModal >
  )
}

export default NewPostModal;