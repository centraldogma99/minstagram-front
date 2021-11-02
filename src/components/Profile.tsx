import React from "react"
import styled from "styled-components"
// import useProfile from "../hooks/useProfile";
import { IUser } from "../types/postTypes";
import { backServer } from "../configs/env";
import { Link } from "react-router-dom";

const AvatarImage = styled.img`
  width: 25px;
  height: 25px;
`;
const AvatarName = styled.span`
  font-size: 15px;
`;

// name is ambiguous: recommend AvatarWithName
const Profile = (props: { user: IUser, onClick?: any }) => {
  // const { image, name } = useProfile(props.user);
  const { user, onClick } = props;
  console.log(user);
  if (!user) return <span>hmm, something gone wrong.</span>;
  return (
    <Link to={`/${user.name}`}>
      <span className="profile" onClick={onClick}>
        <AvatarImage src={backServer + "/images/" + user.avatar} />&nbsp;
        <AvatarName >{user.name}</AvatarName>
      </span>
    </Link>

  )
}

export default Profile;