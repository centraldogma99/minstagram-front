import React, { useState, useEffect } from 'react';
import MinstagramModal from '../Modal/MinstagramModal';
import { css } from "@emotion/css"
import TextEditorWithLength from '../TextEditorWithLength/TextEditorWithLength';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import axios from 'axios';
const backServer = process.env.REACT_APP_backServer;
import { Divider } from '@mui/material';
import { useHistory } from 'react-router-dom';
import _ from 'lodash'
import { containerStyle, Textarea, Button_, FormItem, FormItemName, ResultDiv, Text } from './ProfileEditModalStyles';

const ProfileEditModal = (props: { open: boolean, onClose: () => void, bio: string }) => {
  const { user, setUser } = useContext(AuthContext)
  const [name, setName] = useState<string>(user.name);
  const [bio, setBio] = useState<string>(props.bio);
  const [done, setDone] = useState<boolean>(false);

  const [prevPW, setPrevPW] = useState<string>("");
  const [newPW, setNewPW] = useState<string>("")
  const [newPWRepeat, setNewPWRepeat] = useState<string>("")

  const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false);

  const [nameError, setNameError] = useState<{ error: boolean, reason: string }>({ error: false, reason: "" });
  const [prevPasswordError, setPrevPasswordError] = useState<boolean>(false);
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);

  const [isChanged, setIsChanged] = useState<{ name: boolean, bio: boolean }>({ name: false, bio: false });

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
    setName(user.name)
    setBio(props.bio)
    setIsPasswordChange(false);
    setIsChanged({ name: false, bio: false })
    setPrevPasswordError(false)
    setNewPasswordError(false)
    setNameError({ error: false, reason: "" })
    setPrevPW("")
    setNewPW("")
    setNewPWRepeat("")
    props.onClose();
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setName(s);
    checkName(s);
    if (user.name === s) setIsChanged(prev => { return { ...prev, name: false } })
    else setIsChanged(prev => { return { ...prev, name: true } })
  }

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const s = e.target.value;
    setBio(s);
    if (props.bio === s) setIsChanged(prev => { return { ...prev, bio: false } })
    else setIsChanged(prev => { return { ...prev, bio: true } })
  }

  const onChangePassword = (setState: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const s = e.target.value;
      setState(s);
      setNewPasswordError(false);
    }
  }

  const onSubmitPassword = async () => {
    if (prevPW === "") setPrevPasswordError(true);
    if (newPW != newPWRepeat) setNewPasswordError(true);
    if (newPasswordError) return;

    await axios.post(`${backServer}/users/changePassword`,
      { prevPassword: prevPW, newPassword: newPW },
      { withCredentials: true })
    setDone(true)
  }

  const checkName = async (name: string) => {
    if (name.length > 20) {
      setNameError({ error: true, reason: "이름은 20자 이내여야 합니다." })
      return;
    }
    const res: any = await axios.get(`${backServer}/users/namecheck`, { params: { name } })
    const msg = !res.data.result ? "이미 존재하는 이름입니다." : ""
    if (name !== user.name) setNameError({ error: !res.data.result, reason: msg });
    else setNameError({ error: false, reason: "" })
  }

  return (
    <MinstagramModal
      open={props.open}
      onClose={onClose}
      title={!isPasswordChange ? "프로필 수정하기" : "비밀번호 변경하기"}
      width="40em"
      height="40em"
      next={!done ?
        {
          text: !isPasswordChange ? '수정하기' : '변경하기',
          onClick: isPasswordChange ? onSubmitPassword : onClick
        } :
        undefined
      }
      nextInactive={isPasswordChange ?
        prevPW === "" || newPW === "" || newPWRepeat === "" || prevPasswordError || newPasswordError :
        nameError.error || !(isChanged.bio || isChanged.name)}
    >
      <div className={containerStyle}>
        {(!done && !isPasswordChange) && <>
          <p className={css`font-size: 2em; font-weight: 350; margin-top: 2em; `}>나의 Minstagram 프로필</p>
          <div className={css`margin-left: 5em; margin-right: 5em; margin-top: 5em;`}>
            <FormItem>
              <FormItemName>이름</FormItemName>
              <div className={css`flex: 1; display: flex; flex-direction: column; align-items: center;`}>
                <Text type="text" placeholder={user.name} value={name} onChange={_.throttle(onChangeName, 600)} error={nameError.error} />
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
                  onChange={onChangeBio}
                />
              </TextEditorWithLength>
            </FormItem>
            <Divider />
            <Button_ onClick={() => setIsPasswordChange(true)}>비밀번호 변경하기</Button_>
          </div>
        </>}

        {(!done && isPasswordChange) && <>
          <p className={css`font-size: 2em; font-weight: 350; margin-top: 2em; `}>비밀번호 변경</p>
          <div className={css`margin-left: 5em; margin-right: 5em; margin-top: 5em;`}>
            <FormItem>
              <FormItemName big>이전 비밀번호</FormItemName>
              <Text type="password" placeholder="이전 비밀번호" value={prevPW}
                onChange={_.throttle(onChangePassword(setPrevPW), 500)}
                error={prevPasswordError} />
            </FormItem>
            <FormItem>
              <FormItemName big>새 비밀번호</FormItemName>
              <Text type="password" placeholder="새 비밀번호" value={newPW}
                onChange={_.throttle(onChangePassword(setNewPW), 500)}
                error={newPasswordError} />
            </FormItem>
            <FormItem>
              <FormItemName big>새 비밀번호 다시 입력</FormItemName>
              <Text type="password" placeholder="새 비밀번호 다시 입력" value={newPWRepeat}
                onChange={_.throttle(onChangePassword(setNewPWRepeat), 500)}
                error={newPasswordError} />
            </FormItem>
          </div>
        </>}

        {done && <>
          <ResultDiv>
            <img src="https://www.instagram.com/static/images/creation/30fpsCheckLoopsOnce.gif/10a8cbeb94ba.gif" />
            <p className={css`font-weight: 250; font-size: 1.5em; `}>
              {isPasswordChange ? "비밀번호를 변경했습니다." : "프로필을 수정했습니다."}
            </p>
          </ResultDiv>
        </>}
      </div>
    </MinstagramModal>
  )
}

export default ProfileEditModal;