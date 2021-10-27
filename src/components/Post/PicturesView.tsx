import React from "react";
import styled from "styled-components";
import { backServer } from "../../configs/env";

type PicturesViewProps = {
  pictures: string[]
}

const PostPicture = styled.img`
  width: 480px;
  height: 600px;
`;

// 넘기기 기능 구현할것
// 지금은 단순 img 태그
const PicturesView = (props: PicturesViewProps) => {
  return (
    <PostPicture src={`${backServer}/images/${props.pictures[0]}`} />
  )
}

export default PicturesView;