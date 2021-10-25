import React from "react"

import instaLogo from "./logo.png"
import direct from "./direct.svg"
import heart from "./heart.svg"
import Profile from "../Profile"
import "./TopBar.css"
import styled from "styled-components"

const TopBar = () => {
  const TopBarButton = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 5px;
  `;

  return (
    <div id="TopBar">
      <img src={instaLogo} id="instaLogo" />
      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          <TopBarButton src={direct} />
          <TopBarButton src={heart} />
        </span>
        <Profile id="1234" />
      </span>
    </div>
  )
}

export default TopBar