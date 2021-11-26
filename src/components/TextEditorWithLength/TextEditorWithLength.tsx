import React, { useEffect } from "react"
import { useState } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/css"


// children은 value prop을 가지는 텍스트 컴포넌트여야 한다.
const TextEditorWithLength = (props: { textMaxLength: number, children: any, style?: string, setText: any, textLengthStyle?: string }) => {
  const text = props.children.props.value;
  const { textMaxLength } = props;

  const TextLength = styled.div`
    position: absolute;
    font-size: 0.8em;
    color: ${text.length <= textMaxLength ? "gray" : "red"};
    top: 105%;
    left: 94%;
    transform: translate(-90%, -90%);
    ${props.textLengthStyle}
  `;

  useEffect(() => {
    if (text.length > textMaxLength) {
      props.setText(text.slice(0, textMaxLength));
    }
  }, [text])

  const TextEditorWithLengthStyle = css`
    width: 100%;
    height: 12em;
    position: relative;
    ${props.style}
  `

  return (
    <div className={TextEditorWithLengthStyle}>
      {props.children}
      <TextLength>
        {`${text.length}/${textMaxLength}`}
      </TextLength>
    </div>
  )
}

export default TextEditorWithLength;