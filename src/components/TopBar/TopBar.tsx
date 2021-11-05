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

const TopBarButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

//https://mui.com/guides/routing/#list

const TopBar = () => {
  const { user } = useContext(AuthContext);
  // const { show, anchorPoint, handleContext } = useContextMenu();

  return (
    <div id="TopBar">
      <Link to="/">
        <img src={instaLogo} id="instaLogo" />
      </Link>

      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          <Link to="/directs">
            <TopBarButton src={direct} />
          </Link>
          <TopBarButton src={heart} />
          <Link to="/newPost">
            <TopBarButton src={newpost} />
          </Link>
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