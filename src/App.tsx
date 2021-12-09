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
import { backServer } from "./configs/env";
import { PostsStyle } from "./components/Post/Posts"
import Cookies from "js-cookie";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = useState<IUser>({ _id: "", name: "", avatar: "", email: "" });

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

  // 로그인 되어있는지 여부 확인
  useLayoutEffect(() => {
    checkCookie();
  }, [])

  // if (!Cookies.get('credentials')) setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, checkCookie }}>
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
                  <Post />
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
    </AuthContext.Provider>
  );
}

export default App;
