import React from "react"
import styled from "styled-components"
// import useProfile from "../hooks/useProfile";
import { IUser } from "../types/postTypes";
import { backServer } from "../configs/env";
import { Link } from "react-router-dom";
import { css } from "@emotion/css"

const AvatarImage = styled.img`
  width: 38%;
  height: 100%;
  margin-right: 10%;
`;
const AvatarName = styled.span`
  font-size: 15px;
  font-weight: 580;
`



// name is ambiguous: recommend AvatarWithName
const Profile = (props: { user: IUser, width?: string, onClick?: any }) => {
  const profileStyle = css`
    display: flex;
    align-items: center;
    width: ${props.width ?? "5em"}; 
  `
  // const { image, name } = useProfile(props.user);
  const { user, onClick } = props;
  if (!user) return <span>hmm, something gone wrong.</span>;
  return (
    <Link to={`/${user.name}`}>
      <span className={profileStyle} onClick={onClick}>
        <AvatarImage src={backServer + "/images/" + user.avatar} />&nbsp;
        <AvatarName >{user.name}</AvatarName>
      </span>
    </Link>

  )
}

export default Profile;