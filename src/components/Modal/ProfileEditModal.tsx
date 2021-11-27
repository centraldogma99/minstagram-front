import React, { useState, useEffect } from 'react';
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
import { useHistory } from 'react-router-dom';
import _ from 'lodash'

const containerStyle = css`
  text-align: center;
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

const Text = styled(InputText) <{ error?: boolean }>`
  width: 95%;
  border: 0.5px gainsboro solid;
  border-color: ${props => props.error ? 'red' : undefined};
  border-width: ${props => props.error ? '2.2px' : undefined};
`

const ProfileEditModal = (props: { open: boolean, onClose: () => void, bio: string }) => {
  const { user, setUser } = useContext(AuthContext)
  const [name, setName] = useState<string>(user.name);
  const [bio, setBio] = useState<string>(props.bio);
  const [done, setDone] = useState<boolean>(false);

  const [nameError, setNameError] = useState<{ error: boolean, reason: string }>({ error: false, reason: "" });

  const history = useHistory();

  useEffect(() => {
    if (done) history.push(`/${name}`)
  }, [done])

  const onClick = async () => {
    if (name.length < 2) {
      setNameError({ error: true, reason: "이름은 2자 이상이어야 합니다." });
      return;
    }
    if (nameError.error) return;
    await axios.post(`${backServer}/users/profile`, { name, bio }, { withCredentials: true })
    setDone(true)
    setUser(prev => { return { ...prev, name: name } })
  }

  const onClose = () => {
    setDone(false)
    props.onClose();
  }

  const onChange = (e: any) => {
    const s = e.target.value;
    setName(s);
    checkName(s);
  }

  const checkName = async (name: string) => {
    if (name.length > 20) {
      setNameError({ error: true, reason: "이름은 20자 이내여야 합니다." })
      return;
    }
    const res: any = await axios.get(`${backServer}/users/namecheck`, { params: { name } })
    const msg = !res.data.result ? "이미 존재하는 이름입니다." : ""
    setNameError({ error: !res.data.result, reason: msg });
  }

  return (
    <MinstagramModal
      open={props.open}
      onClose={onClose}
      title="프로필 수정하기"
      width="40em"
      height="40em"
      next={!done ?
        {
          text: '수정하기',
          onClick
        } :
        undefined
      }
      nextInactive={nameError.error}
    >
      <div className={containerStyle}>
        {!done && <>
          <p className={css`font-size: 2em; font-weight: 350; margin-top: 2em; `}>나의 Minstagram 프로필</p>
          <div className={css`margin-left: 5em; margin-right: 5em; margin-top: 5em;`}>
            <FormItem>
              <FormItemName>이름</FormItemName>
              <div className={css`flex: 1; display: flex; flex-direction: column; align-items: center;`}>
                <Text type="text" placeholder={user.name} value={name} onChange={_.throttle(onChange, 600)} error={nameError.error} />
                {nameError && <div className={css`width: 100%; padding-left: 1em;`}>
                  <p className={css`margin: 0; margin-top: 0.2em; font-size: 0.8em; color: red; text-align: left;`}>
                    {nameError.reason}
                  </p>
                </div>}
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
            <p className={css`font-weight: 250; font-size: 1.5em; `}>프로필을 수정했습니다.</p>
          </ResultDiv>
        </>}
      </div>
    </MinstagramModal>
  )
}

export default ProfileEditModal;