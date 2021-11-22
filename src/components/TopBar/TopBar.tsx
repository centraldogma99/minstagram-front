import React, { useState, useContext } from "react"
import direct from "./direct.svg"
import heart from "./heart.svg"
import Profile from "../Profile"
import newpost from "./newpost.svg"
import "./TopBar.css"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import AuthContext from "../../context/authContext"
import axios from "axios"
import { backServer } from "../../configs/env"
import NewPostModal from "../Modal/NewPostModal"
import { css } from "@emotion/css"

const TopBarButton = styled.img`
  width: 1.5em;
  height: 1.5em;
  margin-right: 1em;
`;

const TopBarProfile = css`
  margin-right: 0.5em;
`

const TopBar = () => {
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [isNewPost, setIsNewPost] = useState(false);
  const history = useHistory();
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

      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          {/* <Link to="/directs">
            <TopBarButton src={direct} />
          </Link> */}
          <TopBarButton src={heart} onClick={useLogout} />
          <TopBarButton src={newpost} onClick={() => { setIsNewPost(true) }} />
        </span>
        <span className={TopBarProfile}>
          <Profile nameShown={false} user={user} imageWidth="1.5em" />
        </span>


        {/* {show && <ul
          className="menu"
          style={{
            top: anchorPoint.y,
            left: anchorPoint.x
          }}
        >
          <li>Share to..</li>
          <li>Cut</li>
          <li>Copy</li>
          <li>Paste</li>
          <hr className="divider" />
          <li>Refresh</li>
          <li>Exit</li>
        </ul>} */}
      </span>
    </div >
  )
}

export default TopBar