import React, { useEffect, useState, useContext } from "react"
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
import { Link } from "react-router-dom"
import AuthContext from "../../context/authContext"

const TopBarButton = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

//https://mui.com/guides/routing/#list

const TopBar = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  // const { show, anchorPoint, handleContext } = useContextMenu();
  const [me, setMe] = useState<IUser>({
    _id: "",
    name: "",
    avatar: ""
  });

  // TODO: remove this
  useEffect(() => {
    async function get() {
      const user: IUser = await getUserInfo();
      setMe(user);
    }
    get()
      .catch(() => {
        console.log("auth error")
        setIsAuthenticated(false);
      });
  }, [])

  return (
    <div id="TopBar">
      <img src={instaLogo} id="instaLogo" />
      <span id="TopBarRightSide">
        <span id="TopBarButtons">
          <TopBarButton src={direct} />
          <TopBarButton src={heart} />
          <Link to="/newPost">
            <TopBarButton src={newpost} />
          </Link>
        </span>
        <Link to="/changeProfile">
          <Profile user={me} />
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
    </div>
  )
}

export default TopBar