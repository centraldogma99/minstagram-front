import React, { useRef } from "react";
import styled from "@emotion/styled";
import { backServer } from "../../configs/env";
import { useState } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import { css } from "@emotion/css"
import { useEffect } from "react";

type PicturesViewProps = {

}

const PostPicture = styled.img`
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  /* transform: translateY(-50%); */
  max-width: 100%;
  max-height: 100%;
  height: auto;
`;

const nextButton = css`
  position: absolute;
  top: 50%;
  left: 97%;
  transform: translateY(-50%);
`

const beforeButton = css`
  position: absolute;
  top: 50%;
  right: 97%;
  transform: translateY(-50%);
`

// 넘기기 기능 구현할것
const PicturesView = (props: { pictures: string[], isURL?: boolean, height?: string }) => {
  const [viewSize, setViewSize] = useState<{ height: number, width: number }>()

  // newPost에서는 isURL = true
  const PostPictureContainer = css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    /* width: 100%; */
    min-height: 17em;
    height: ${viewSize?.height && viewSize?.height > 0 && !props.isURL ? viewSize?.height + "px" : "100%"};
    /* height: 100%; */
    /* position: relative; */
    /* overflow: auto;
    min-height: 10em;
    height: 100%;
    text-align: center; */
  `
  const [current, setCurrent] = useState<number>(0);

  const view = useRef<any>();

  const onLoad = () => {
    if (!viewSize && current === 0)
      setViewSize({ height: view.current.offsetHeight, width: view.current.offsetWidth });
  }

  const onClickNext = () => {
    if (current + 1 <= props.pictures.length - 1) {
      setCurrent(current + 1)
    }
  }

  const onClickBefore = () => {
    if (current - 1 >= 0) {
      setCurrent(current - 1)
    }
  }

  return (
    <div className={PostPictureContainer}>
      {current - 1 >= 0 && <NavigateBeforeIcon onClick={onClickBefore} className={beforeButton} />}
      <PostPicture
        src={props.isURL ? props.pictures[current] : `${backServer}/images/${props.pictures[current]}`}
        ref={view}
        onLoad={onLoad}
      />
      {current + 1 <= props.pictures.length - 1 && <NavigateNextIcon onClick={onClickNext} className={nextButton} />}
    </div>
  )
}

export default PicturesView;