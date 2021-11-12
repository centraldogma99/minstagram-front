import React from "react"
// import useProfile from "../hooks/useProfile";
import { IUser } from "../types/postTypes";
import { backServer } from "../configs/env";
import { Link } from "react-router-dom";
import { css } from "@emotion/css"

// name is ambiguous: recommend AvatarWithName
const Profile = (props: { user: IUser, imageWidth?: string, nameFontSize?: string, onClick?: any }) => {
  const profileStyle = css`
    display: flex;
    align-items: center;
  `

  const AvatarImage = css`
    width: ${props.imageWidth ?? "2.5em"};
    height: ${props.imageWidth ?? "2.5em"};
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid gray;
  `;

  const AvatarName = css`
    margin-left: 0.7em;
    font-size: ${props.nameFontSize ?? "15px"};
    font-weight: 580;
  `
  // const { image, name } = useProfile(props.user);
  const { user, onClick } = props;
  if (!user) return <span>hmm, something gone wrong.</span>;
  return (
    <Link to={`/${user.name}`}>
      <span className={profileStyle} onClick={onClick}>
        <img src={backServer + "/images/" + user.avatar} className={AvatarImage} />
        <span className={AvatarName}>{user.name}</span>
      </span>
    </Link>
  )
}

export default Profile;