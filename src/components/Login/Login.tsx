import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import "./Login.css"
import { backServer } from "../../configs/env";
import axios from "axios"
import Cookies from 'js-cookie';
import AuthContext from "../../context/authContext";
import { Divider } from "@mui/material";
import { css } from "@emotion/css";


const LoginInputText = styled.input`
  height: 2.5em;
  width: 20em;
  font-size: 1em;
  margin-bottom: 1em;
  padding-left: 0.4em;
  border-radius: 3px;
  border: 0.5px solid gainsboro;
`;

const LoginButton = styled.button`
  margin-top: 0.5em;
  text-align: center;
  font-size: 1em;
  width: 20.6em;
  height: 2.2em;
  border: none;
  background-color: dodgerblue;
  border-radius: 4px;
  color: white;
  font-weight: 580;
  margin-bottom: 2em;
`;

const blueBold = css`
  color: dodgerblue;
  font-weight: 700;
`

const willYouRegister = css`
  margin-top: 1.4em;
`

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  // 이미 로그인되어 있을 경우
  // useEffect를 쓸 필요도 없을지도?
  useEffect(() => {
    const storageUser = localStorage.getItem('user')
    if (storageUser && Cookies.get('credential')) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storageUser))
    }
  }, [])

  const validate = (userInfo: { email: string, name: string, password: string }) => {
    let msg;
    const { email, name, password } = userInfo;
    if (!email.includes("@") || !email.includes(".")) {
      msg = "유효하지 않은 이메일 입니다."
    } else if (name.includes("dog")) {
      msg = "계정 이름에 'dog'을 포함할 수 없습니다."
    } else if (password.length < 8) {
      msg = "비밀번호는 8자 이상이어야 합니다."
    }

    if (msg) {
      return {
        isValid: false,
        msg: msg
      }
    } else {
      return {
        isValid: true,
        msg: "validate successful"
      }
    }
  }

  const handleChange = (setState: any) => {
    return (e: any) => {
      setState(e.target.value);
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isRegister) {
      const res = await axios.post(backServer + "/users/login", {
        email: email,
        password: password
      }, { withCredentials: true })
        .catch((e: any) => e.response);

      if (res?.status === 200) {
        console.log('hi');
        localStorage.setItem('user', JSON.stringify((res as any).data));
        setIsAuthenticated(true);
        setUser(res.data);
        return;
      } else {
        //FIXME 임시로 alert로 구현했음
        setStatusText("로그인 실패 : " + res?.data);
        setEmail("");
        setPassword("");
      }
    } else {
      const userInfo = { email: email, name: name, password: password }
      const validCheck = validate(userInfo);
      if (validCheck.isValid) {
        const res = await axios.post(backServer + "/users/register", userInfo)
          .catch((e) => { console.log(e); return e.response });
        if (res?.status === 200) {
          setStatusText("");
        } else {
          setStatusText("가입 실패 : " + res?.data)
        }
      } else {
        setStatusText(validCheck.msg);
      }

      // 다시 로그인하도록 한다
      setPassword("");
      setName("");
      setEmail("");

      setIsRegister(false);
    }
  }

  const handleRegister = () => {
    setIsRegister(true);
  }

  return (
    <div id="login">
      <p id="loginTitle">
        Minstagram
      </p>
      <form id="loginForm" onSubmit={handleSubmit}>
        <LoginInputText type="text" value={email} onChange={handleChange(setEmail)} placeholder="이메일" />
        <br />
        {isRegister && <span>
          <LoginInputText type="text" value={name} onChange={handleChange(setName)} placeholder="계정 이름" />
          <br />
        </span>}
        <LoginInputText type="password" value={password} onChange={handleChange(setPassword)} placeholder="비밀번호" />
        <br />
        {statusText}
        <LoginButton>{isRegister ? '가입' : '로그인'}</LoginButton>


        {!isRegister &&
          <>
            <Divider />
            <div className={willYouRegister}>
              계정이 없으신가요? <a onClick={handleRegister} className={blueBold}>가입하기</a>
            </div>
          </>
        }


      </form>
    </div>
  )
}

export default Login;