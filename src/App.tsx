import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Mypage from "./components/Mypage/Mypage";
import {
  Switch,
  Route,
} from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import Posts from "./components/Post/Posts"
import AuthContext from "./context/authContext";
import { IUser } from "./types/postTypes";
import DirectList from "./components/direct/DirectList";
import Post from "./components/Post/Post"
import { useLayoutEffect } from "react";
import axios from "axios";
import { PostsStyle } from "./components/Post/Posts"
import Cookies from "js-cookie";
import ToastContext from "./context/ToastContext";
import { Snackbar } from "@mui/material";
const backServer = process.env.REACT_APP_backServer;

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = useState<IUser>({ _id: "", name: "", avatar: "", email: "" });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const checkCookie = () => {
    const cookie = Cookies.get('credential')
    if (cookie) {
      setIsAuthenticated(true);

      // 로그인 되어 있는 경우, 유저 정보 리프레쉬
      if (user._id.length > 0) {
        (async () => {
          try {
            const res = await axios.get<IUser>(`${backServer}/users/${user._id}`, { withCredentials: true });
            setUser(res.data);
          } catch (e) {
            console.log(e);
          }
        })();
      }
      return true;
    } else {
      setIsAuthenticated(false);
      return false;
    }
  }

  const handleToastClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setToastOpen(false);
  };

  // 로그인 되어있는지 여부 확인
  useLayoutEffect(() => {
    checkCookie();
  }, [])

  // if (!Cookies.get('credentials')) setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, checkCookie }}>
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        message={toastMessage}
      />
      <ToastContext.Provider value={{ setToastOpen, toastMessage, setToastMessage }}>
        <div className="App">
          {!isAuthenticated && <Login />}
          {isAuthenticated && <>
            <TopBar />
            <div id="contentWrapper">
              <Switch>
                <Route exact path="/directs">
                  <DirectList />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/posts/:postId">
                  <div className={PostsStyle}>
                    <Post commentMenu={true} />
                  </div>
                </Route>
                <Route path="/:userNameParam">
                  <Mypage />
                </Route>
                <Route exact path="/">
                  <Posts />
                </Route>
              </Switch>
            </div>
          </>}
        </div>
      </ToastContext.Provider>
    </AuthContext.Provider >
  );
}

export default App;
