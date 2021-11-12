import React, { useEffect } from "react"
import { useState } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/css"



const TextEditorWithLength = (props: { textMaxLength: number, children: any, fontSize?: string, width?: string, height?: string, setText?: any }) => {
  const text = props.children.props.value;
  const { textMaxLength, fontSize, width, height } = props;

  const TextLength = styled.div`
    position: absolute;
    font-size: ${fontSize ?? "0.8em"};
    color: ${text.length <= textMaxLength ? "gray" : "red"};
    top: 105%;
    left: 94%;
    transform: translate(-90%, -90%);
  `;

  useEffect(() => {
    if (text.length > textMaxLength) {
      props.setText(text.slice(0, textMaxLength));
    }
  }, [text])

  const TextEditorWithLengthStyle = css`
    width: ${width ?? "100%"};
    height: ${height ?? "12em"};
    position: relative;
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