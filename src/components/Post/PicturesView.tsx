import React from "react";
import styled from "@emotion/styled";
import { backServer } from "../../configs/env";

type PicturesViewProps = {
  pictures: string[]
}

const PostPictureContainer = styled.div`
  text-align: center;
`

const PostPicture = styled.img`
  max-width: 100%;
`;

// 넘기기 기능 구현할것
// 지금은 단순 img 태그
const PicturesView = (props: PicturesViewProps) => {
  return (
    <PostPictureContainer>
      <PostPicture src={`${backServer}/images/${props.pictures[0]}`} />
    </PostPictureContainer>
  )
}

export default PicturesView;