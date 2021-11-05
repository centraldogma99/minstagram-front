import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Mypage from "./components/Mypage/Mypage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import NewPost from "./components/Post/NewPost";
import Posts from "./components/Post/Posts"
import ChangeProfile from "./components/Mypage/ChangeProfile";
import AuthContext from "./context/authContext";
import { IUser } from "./types/postTypes";
import EditPost from "./components/Post/EditPost";
import DirectList from "./components/direct/DirectList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = useState<IUser>({ _id: "", name: "", avatar: "", email: "" });
  const PrivateRoute = ({ children, ...rest }: any) => {
    return (
      <Route
        {...rest}
        render={
          () => {
            isAuthenticated ?
              children :
              <Redirect to="/login" />
          }
        }
      />
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>

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
              <Route exact path="/newPost">
                <NewPost />
              </Route>
              <Route exact path="/changeProfile">
                <ChangeProfile />
              </Route>
              <Route exact path="/posts/:postId/edit">
                <EditPost />
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
