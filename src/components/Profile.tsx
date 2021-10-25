import React from "react"
import styled from "styled-components"
import useProfile from "../hooks/useProfile";

const AvatarImage = styled.img`
  width: 25px;
  height: 25px;
`;
const AvatarName = styled.span`
  font-size: 15px;
`;

const Profile = (props: { userId: string, onClick?: any }) => {
  const { image, name } = useProfile(props.userId);

  return (
    <span className="profile" onClick={props.onClick}>
      <AvatarImage src={image} />&nbsp;
      <AvatarName >{name}</AvatarName>

    </span>
  )
}

export default Profile;