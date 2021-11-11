import React from "react"
import { useState } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/css"



const TextEditorWithLength = (props: { textMaxLength: number, fontSize?: string, className?: string, width?: string, height?: string, placeholder?: string, setText?: any }) => {
  const [text, setText] = useState<string>("");

  const { textMaxLength, fontSize, className, width, height, placeholder, ...rest } = props;

  const TextLength = styled.div`
    position: absolute;
    font-size: ${fontSize ?? "0.8em"};
    color: ${text.length <= textMaxLength ? "gray" : "red"};
    top: 105%;
    left: 94%;
    transform: translate(-90%, -90%);
  `;

  const TextEditorWithLengthStyle = css`
    width: ${width ?? "100%"};
    height: ${height ?? "12em"};
    position: relative;
  `

  const onChange = (e: any) => {
    let t = e.target.value;
    if (e.target.value.length > textMaxLength) {
      t = t.slice(0, textMaxLength);
    }

    setText(t);
    props.setText(t);
  }

  return (
    <div className={TextEditorWithLengthStyle}>
      <textarea
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        value={text}
        {...rest}
      />
      <TextLength>
        {`${text.length}/${textMaxLength}`}
      </TextLength>
    </div>
  )
}

export default TextEditorWithLength;