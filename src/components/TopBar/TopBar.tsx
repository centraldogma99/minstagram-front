import React, { useEffect, useState, useContext } from "react"
import instaLogo from "./logo.png"
import direct from "./direct.svg"
import heart from "./heart.svg"
import Profile from "../Profile"
import newpost from "./newpost.svg"
import "./TopBar.css"
import styled from "styled-components"
// import useContextMenu from "../../hooks/useContext"
import { IUser } from "../../types/postTypes"
import { Link } from "react-router-dom"
import AuthContext from "../../context/authContext"
import axios from "axios"
import { backServer } from "../../configs/env"
import NewPostModal from "../Modal/NewPostModal"

const TopBarButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

//https://mui.com/guides/routing/#list

const TopBar = () => {
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [isNewPost, setIsNewPost] = useState(false);
  const useLogout = () => {
    axios.get(`${backServer}/users/logout`, { withCredentials: true })
    setIsAuthenticated(false);
    setUser({ _id: "", name: "", avatar: "", email: "" });
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
          <Link to="/directs">
            <TopBarButton src={direct} />
          </Link>
          <TopBarButton src={heart} onClick={useLogout} />
          {/* <Link to="/newPost"> */}
          <TopBarButton src={newpost} onClick={() => { setIsNewPost(true) }} />
          {/* </Link> */}
        </span>
        <Link to={"/" + user.name}>
          <Profile user={user} />
        </Link>

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