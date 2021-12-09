import React, { useRef, useEffect } from "react";
import { backServer } from "../../configs/env";
import { useState } from "react";
import before from '../../assets/before.svg'
import next from '../../assets/next.svg'
import { css } from "@emotion/css"

const navButton = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1.6em;
  height: 1.6em;
  opacity: 0.5;
  cursor: pointer;
`

const nextButton = css`
  ${navButton}
  left: 93%;
`

const beforeButton = css`
  ${navButton}
  right: 93%;
`

// 넘기기 기능 구현할것
const PicturesView = (props: { pictures: string[], isURL?: boolean, sizeCalc?: boolean, style?: string, containerStyle?: string }) => {
  const [viewSize, setViewSize] = useState<{ height: number, width: number }>()

  // newPost에서는 isURL = true
  const PostPictureContainer = css`
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
    position: relative;
    height: ${viewSize?.height && viewSize?.height > 0 && props.sizeCalc ? viewSize?.height + "px" : "100%"};
    ${props.containerStyle}
  `

  const PostPicture = css`
    /* display: block;
    max-height: 100%;
    max-width: 100%; */
    ${props.style}
  `;

  const [current, setCurrent] = useState<number>(0);

  const view = useRef<any>();

  useEffect(() => {
    if (!props.isURL) {
      props.pictures.forEach(picture => {
        const img = new Image();
        img.src = `${backServer}/images/${picture}`;
        // setPictures(prev => [...prev, img])
      })
    }
  }, [])

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
      {current - 1 >= 0 && <img src={before} onClick={onClickBefore} className={beforeButton} />}
      <img
        className={PostPicture}
        src={props.isURL ? props.pictures[current] : `${backServer}/images/${props.pictures[current]}`}
        ref={view}
        onLoad={onLoad}
      />
      {current + 1 <= props.pictures.length - 1 && <img src={next} onClick={onClickNext} className={nextButton} />}
    </div>
  )
}

export default PicturesView;