import React from "react";
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

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
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <div className="App">
          {!isAuthenticated && <Login />}
          {isAuthenticated && <>
            <TopBar />
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/newPost">
                <NewPost />
              </Route>
              <Route path="/changeProfile">
                <ChangeProfile />
              </Route>
              <Route path="/:userNameParam">
                <Mypage />
              </Route>
              <Route path="/">
                <Posts />
              </Route>

            </Switch>
          </>}
        </div>
      </Router>
    </AuthContext.Provider>


  );
}

export default App;
