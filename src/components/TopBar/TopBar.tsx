import React, { useState, useContext } from "react"
import Profile from "../Profile"
import newpost from "./newpost.svg"
import "./TopBar.css"
import { Link } from "react-router-dom"
import AuthContext from "../../context/authContext"
import axios from "axios"
import { backServer } from "../../configs/env"
import NewPostModal from "../Modal/NewPostModal"
import { css } from "@emotion/css"
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchText from "../search/SearchText"

const TopBarButtonStyle = css`

  width: 1.5em;
  height: 1.5em;
  margin-right: 1em;
  cursor: pointer;
`;

const TopBarProfile = css`
  margin-right: 0.5em;
`

const TopBar = () => {
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [isNewPost, setIsNewPost] = useState(false);
  const useLogout = () => {
    axios.get(`${backServer}/users/logout`, { withCredentials: true })
    setIsAuthenticated(false);
    setUser({ _id: "", name: "", avatar: "", email: "" });
    // history.push('/login')
  }
  // const { show, anchorPoint, handleContext } = useContextMenu();

  return (
    <div id="TopBar">
      <NewPostModal open={isNewPost} onClose={() => { setIsNewPost(false) }} />
      <Link to="/">
        <span className="logo">
          Minstagram
        </span>
      </Link>
      <SearchText />
      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          {/* <Link to="/directs">
            <TopBarButton src={direct} />
          </Link> */}
          <a className={css`cursor: pointer;`}>
            <LogoutIcon className={css`margin-right: 0.5em; vertical-align: middle;`} onClick={useLogout} />
          </a>

          <a href="https://psychedelic-feeling-5d5.notion.site/Junyeong-Choi-e84719c1ecfc464a9fc06908fd68a8b5">
            <QuestionMarkIcon className={css`margin-right: 0.5em; vertical-align: middle;`} />
          </a>

          <img src={newpost} className={TopBarButtonStyle} onClick={() => { setIsNewPost(true) }} />
        </span>
        <span className={TopBarProfile}>
          <Profile nameHide user={user} imageStyle={css`width: 1.5em; height: 1.5em;`} />
        </span>
      </span>
    </div >
  )
}

export default TopBar;