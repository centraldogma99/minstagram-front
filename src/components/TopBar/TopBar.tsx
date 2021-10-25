import React from "react"
import instaLogo from "./logo.png"
import direct from "./direct.svg"
import heart from "./heart.svg"
import Profile from "../Profile"
import "./TopBar.css"
import styled from "styled-components"
import useContextMenu from "../../hooks/useContext"

const TopBarButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

//https://mui.com/guides/routing/#list

const TopBar = () => {
  const { show, anchorPoint, handleContext } = useContextMenu();

  return (
    <div id="TopBar">
      <img src={instaLogo} id="instaLogo" />
      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          <TopBarButton src={direct} />
          <TopBarButton src={heart} />
        </span>
        <Profile userId="1234" onClick={handleContext} />
        {show && <ul
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
        </ul>}
      </span>
    </div>
  )
}

export default TopBar