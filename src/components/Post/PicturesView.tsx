import React from "react";
import styled from "styled-components";

type PicturesViewProps = {
  pictures: string[]
}

// 넘기기 기능 구현할것
// 지금은 단순 img 태그
const PicturesView = (props: PicturesViewProps) => {
  const PostPicture = styled.img`
    width: 480px;
    height: 600px;
  `;
  return (
    <PostPicture src={props.pictures[0]} />
  )
}

export default PicturesView;