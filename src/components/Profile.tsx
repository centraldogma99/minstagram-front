import React from "react"
import styled from "styled-components"
import useProfile from "../hooks/useProfile";

const Profile = (props: { id: string }) => {
  const AvatarImage = styled.img`
    width: 25px;
    height: 25px;
  `;
  const AvatarName = styled.span`
    font-size: 15px;
  `;

  const { image, name } = useProfile(props.id);

  return (
    <span className="profile">
      <AvatarImage src={image} />&nbsp;
      <AvatarName >{name}</AvatarName>

    </span>
  )
}

export default Profile;