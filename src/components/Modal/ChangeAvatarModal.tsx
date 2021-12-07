import React, { useState } from 'react'
import MinstagramModal from './MinstagramModal';
import { Button } from '@mui/material';
import styled from "@emotion/styled"
import { css } from "@emotion/css"
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import { backServer } from '../../configs/env';
import axios from 'axios';

const Input = styled.input`
  display: none;
`

const NewPostContentContainer = styled.div`
  position: relative;
  height: 100%;
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
  height: 100%;
`

const PicturePreview = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ChangeAvatarModal = (props: { open: boolean, onClose: () => void }) => {
  const [picture, setPicture] = useState<FileList | null>(null);
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  // const [errorText, setErrorText] = useState<string>("");

  const initialize = () => {
    setPicture(null);
    setIsUploaded(false);
  }

  const handleClick = () => {
    const formData = new FormData();
    if (picture !== null) {
      formData.append("profile-picture", picture[0])
    }

    axios.post(`${backServer}/users/changeProfile`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res: any) => {
        setUser({ ...user, avatar: res.data.avatar });
        setIsUploaded(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  };

  return (
    <MinstagramModal
      open={props.open}
      onClose={() => { initialize(); props.onClose(); }}
      title={isUploaded ? "프로필이 변경되었습니다" : "프로필 변경하기"}
      next={picture && !isUploaded ? { text: '변경하기', onClick: handleClick } : undefined}
      width="40em"
      height="40em"
    >
      {!isUploaded &&
        <NewPostContentContainer>
          {!picture &&
            <NewPostContent>
              <p className={messageStyle}>업로드할 사진을 선택하세요.</p>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" type="file"
                  onChange={(e) => setPicture(e.target.files)} />
                <Button variant="contained" component="span">
                  컴퓨터에서 선택
                </Button>
              </label>
            </NewPostContent>
          }
          {picture && picture.length > 0 &&
            <div className={PicturesPreviewContainer}>
              <img src={URL.createObjectURL(picture[0])} className={PicturePreview} />
            </div>
          }
        </NewPostContentContainer>}
      {isUploaded && <NewPostContentContainer>
        <NewPostContentContainer>
          <NewPostContent>
            <img src="https://www.instagram.com/static/images/creation/30fpsCheckLoopsOnce.gif/10a8cbeb94ba.gif" />
            <p className={messageStyle}>프로필이 변경되었습니다.</p>
          </NewPostContent>
        </NewPostContentContainer>
      </NewPostContentContainer>}
    </MinstagramModal >
  )
}

export default ChangeAvatarModal;