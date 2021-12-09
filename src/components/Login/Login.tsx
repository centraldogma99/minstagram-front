import React, { useState, useContext, useLayoutEffect } from "react";
import "./Login.css"
import { backServer } from "../../configs/env";
import axios from "axios"
import Cookies from 'js-cookie';
import AuthContext from "../../context/authContext";
import { Divider } from "@mui/material";
import { css } from "@emotion/css";
import styled from "@emotion/styled"
import { InputText, Button } from "../styled/InputText";
import { IUser } from "../../types/postTypes";

const LoginInputText = styled(InputText)`
  width: 20em;
  margin-bottom: 1em;
  border: ${(props: { wrong?: boolean }) => props.wrong ? "2px solid red" : "0.5px solid gainsboro"};
`;

const LoginButton = styled(Button)`
  margin-top: 0.5em;
  width: 20.6em;
  height: 2.2em;
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
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  // const [name, setName] = useState<string>("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: ""
  })
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [invalidTerms, setInvalidTerms] = useState({
    email: false,
    name: false,
    password: false
  })

  // 이미 로그인되어 있을 경우
  // useEffect를 쓸 필요도 없을지도?
  useLayoutEffect(() => {
    const storageUser = localStorage.getItem('user')
    if (storageUser && Cookies.get('credential')) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storageUser))
    }
  }, [])

  const validateName = (name: string) => {
    if (name.match(/[^A-Za-z._0-9]/g)) return false;
    else return true;
  }

  const validate = (userInfo: { email: string, name: string, password: string }) => {
    let msg;
    const { email, name, password } = userInfo;
    if (!email.includes("@") || !email.includes(".")) {
      msg = "유효하지 않은 이메일 입니다."
      setInvalidTerms({ ...invalidTerms, email: true })
    } else if (!validateName(name)) {
      msg = "계정 이름은 소/대문자, 숫자, 점(.), 밑줄(_)만 가능합니다."
      setInvalidTerms({ ...invalidTerms, name: true })
    } else if (password.length < 8) {
      msg = "비밀번호는 8자 이상이어야 합니다."
      setInvalidTerms({ ...invalidTerms, password: true })
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

  const handleChange = (stateName: string) => {
    return (e: any) => {
      setStatusText("")
      setInvalidTerms({ ...invalidTerms, [stateName]: false })
      setForm({ ...form, [stateName]: e.target.value })
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setInvalidTerms({ email: false, name: false, password: false })
    if (!isRegister) {
      const res = await axios.post<IUser>(backServer + "/users/login", {
        email: form.email,
        password: form.password
      }, { withCredentials: true })
        .catch(e => e.response);
      if (res?.status === 200) {
        localStorage.setItem('user', JSON.stringify((res as any).data));
        setIsAuthenticated(true);
        setUser(res.data);
        return;
      } else {
        let msg = "";
        if (res.status === 404) {
          msg = "존재하지 않는 계정입니다."
          setInvalidTerms({ ...invalidTerms, email: true })
        } else if (res.status === 400) {
          msg = "잘못된 요청입니다."
        } else if (res.status === 401) {
          msg = "잘못된 비밀번호입니다."
          setInvalidTerms({ ...invalidTerms, password: true })
        }
        setStatusText("로그인 실패 : " + msg);
      }
    } else {
      // const userInfo = { email: email, name: name, password: password }
      const validCheck = validate(form);
      if (validCheck.isValid) {
        const res = await axios.post(backServer + "/users/register", form)
          .catch((e) => { console.log(e); return e.response });
        if (res?.status === 200) {
          setStatusText("");
          setIsRegister(false);
        } else {
          let msg;
          if (res.status === 400) {
            msg = "잘못된 요청입니다."
          } else if (res.status === 409) {
            msg = "이미 등록된 계정 또는 이름입니다."
            setInvalidTerms({ ...invalidTerms, email: true, name: true })
          }
          setStatusText("가입 실패 : " + msg)
        }
      } else {
        // 만약 form이 Invalid할 경우.
        setStatusText(validCheck.msg);
        return;
      }

      // 다시 로그인하도록 한다
      setForm({ ...form, password: "", name: "" });
    }
  }

  const handleRegister = () => {
    setIsRegister(true);
    setInvalidTerms({ email: false, name: false, password: false })
  }

  return (
    <div id="login">
      <p id="loginTitle">
        Minstagram
      </p>
      <form id="loginForm" onSubmit={handleSubmit}>
        <LoginInputText type="text"
          value={form.email}
          onChange={handleChange("email")}
          placeholder="이메일"
          wrong={invalidTerms.email} />
        <br />
        {isRegister && <span>
          <LoginInputText type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="계정 이름"
            wrong={invalidTerms.name} />
          <br />
        </span>}
        <LoginInputText type="password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder="비밀번호"
          wrong={invalidTerms.password} />
        <br />
        <div className={css`font-weight: bold; color: red;`}>
          {statusText}
        </div>
        <LoginButton>{isRegister ? '가입' : '로그인'}</LoginButton>

        {!isRegister &&
          <>
            <Divider />
            <div className={willYouRegister}>
              계정이 없으신가요?
              <a onClick={handleRegister} className={blueBold}>가입하기</a>
            </div>
          </>
        }
      </form>
    </div>
  )
}

export default Login;