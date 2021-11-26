import React, { useState } from 'react';
import MinstagramModal from './MinstagramModal';
import { css } from "@emotion/css"
import TextEditorWithLength from '../TextEditorWithLength/TextEditorWithLength';
import { InputText, InputTextArea, Button } from '../styled/InputText';
import styled from '@emotion/styled';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import axios from 'axios';
import { backServer } from '../../configs/env';
import { Divider } from '@mui/material';

const containerStyle = css`
  text-align: center;
`

const Text = styled(InputText)`
  width: 95%;
  border: 0.5px gainsboro solid;
`

const Textarea = styled(InputTextArea)`
  width: 95%;
  border: 0.5px gainsboro solid;
`

const Button_ = styled(Button)`
  width: 70%;
  height: 2.2em;
  margin-top: 3em;
`

const FormItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.5em;
`

const FormItemName = styled.p`
  padding-right: 2em;
  text-align: right;
  width: 2em;
  font-weight: bold;
`

const ResultDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

const ProfileEditModal = (props: { open: boolean, onClose: () => void, bio: string }) => {
  const { user, setUser } = useContext(AuthContext)
  const [name, setName] = useState<string>(user.name);
  const [bio, setBio] = useState<string>(props.bio);
  const [done, setDone] = useState<boolean>(false);

  const onClick = async () => {
    await axios.post(`${backServer}/users/profile`, { name, bio }, { withCredentials: true })
    setDone(true)
    setUser(prev => { return { ...prev, name: name } })
  }

  return (
    <MinstagramModal
      open={props.open}
      onClose={props.onClose}
      title="프로필 수정하기"
      width="40em"
      height="40em"
      next={!done ? {
        text: '수정하기',
        onClick
      } : undefined}
    >
      <div className={containerStyle}>
        {!done && <>
          <p className={css`font-size: 2em; font-weight: 350; margin-top: 2em;`}>계정 이름과 내 소개를 수정합니다.</p>
          <div className={css`margin-left: 5em; margin-right: 5em; margin-top: 5em;`}>
            <FormItem>
              <FormItemName>이름</FormItemName>
              <div className={css`flex: 1;`}>
                <Text type="text" placeholder={user.name} value={name} onChange={(e) => setName(e.target.value)} />
                <p className={css`font-size: 0.8em; color: gray;`}>
                  사람들이 회원님의 알려진 이름을 사용하여 회원님의 계정을 찾을 수 있도록 도와주세요.
                </p>
              </div>
            </FormItem>
            <FormItem>
              <FormItemName>소개</FormItemName>
              <TextEditorWithLength
                textMaxLength={100}
                setText={setBio}
                style={css`flex: 1; height: 4em;`}
                textLengthStyle={css``}
              >
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </TextEditorWithLength>
            </FormItem>
            <Divider />
            <Button_>비밀번호 변경하기</Button_>
          </div>
        </>}

        {done && <>
          <ResultDiv>
            <img src="https://www.instagram.com/static/images/creation/30fpsCheckLoopsOnce.gif/10a8cbeb94ba.gif" />
            <p className={css`font-weight: 250; font-size: 1.5em;`}>프로필을 수정했습니다.</p>
          </ResultDiv>
        </>}
      </div>
    </MinstagramModal>
  )
}

export default ProfileEditModal;