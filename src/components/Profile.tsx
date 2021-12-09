import React from "react"
// import useProfile from "../hooks/useProfile";
import { IUser } from "../types/postTypes";
import { Link } from "react-router-dom";
import { css } from "@emotion/css"
const backServer = process.env.REACT_APP_backServer;

import defaultProfileImage from "../assets/defaultProfile.png"

// name is ambiguous: recommend AvatarWithName
const Profile = (props: {
  user: IUser,
  style?: string,
  imageStyle?: string,
  nameStyle?: string,
  onClick?: any,
  avatarHide?: boolean,
  nameHide?: boolean
}) => {
  const profileStyle = css`
    display: flex;
    align-items: center;
    ${props.style}
  `

  const AvatarImage = css`
    width: 2.5em;
    height: 2.5em;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid gray;
    ${props.imageStyle}
  `;

  const AvatarName = css`
    margin-left: ${props.avatarHide ? undefined : "0.7em"};
    font-size: 15px;
    font-weight: 550;
    ${props.nameStyle}
  `
  // const { image, name } = useProfile(props.user);
  const { user, onClick } = props;
  if (!user) return <span>hmm, something gone wrong.</span>;
  return (
    <Link to={`/${user.name}`}>
      <span className={profileStyle} onClick={onClick}>
        {!props.avatarHide &&
          (user.avatar.length > 0 ?
            <img src={backServer + "/images/" + user.avatar} className={AvatarImage} /> :
            <img src={defaultProfileImage} className={AvatarImage} />)
        }
        {!props.nameHide &&
          <span className={AvatarName}>{user.name}</span>
        }
      </span>
    </Link>
  )
}

export default Profile;