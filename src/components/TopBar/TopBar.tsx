import React, { useEffect, useState } from "react"
import instaLogo from "./logo.png"
import direct from "./direct.svg"
import heart from "./heart.svg"
import Profile from "../Profile"
import newpost from "./newpost.svg"
import "./TopBar.css"
import styled from "styled-components"
// import useContextMenu from "../../hooks/useContext"
import getUserInfo from "../../modules/getUserInfo"
import { IUser } from "../../types/postTypes"

const TopBarButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

//https://mui.com/guides/routing/#list

const TopBar = (props: { setContent: any }) => {
  // const { show, anchorPoint, handleContext } = useContextMenu();
  const [me, setMe] = useState<IUser>({
    _id: "",
    name: "",
    avatar: ""
  });
  const { setContent } = props;

  useEffect(() => {
    getUserInfo()
      .then(res => {
        setMe(res);
      });
  }, [])

  return (
    <div id="TopBar">
      <img src={instaLogo} id="instaLogo" />
      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          <TopBarButton src={direct} onClick={() => { setContent("dm") }} />
          <TopBarButton src={heart} />
          <TopBarButton src={newpost} onClick={() => { setContent("newPost") }} />
        </span>
        <Profile user={me} onClick={() => { setContent("changeProfile") }} />
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
    </div>
  )
}

export default TopBar