import React from "react"
import { css } from "@emotion/css"

const containerStyle = css`
  position: relative;
  height: 2.5em;
  font-size: 0.85em;
`

const childStyleBase = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const redBold = css`
  color: red;
  font-weight: bold;
`

const ModalMenuItem = (props: { onClick?: () => void, isRedBold?: boolean, style?: any, children: any }) => {
  const childStyle = css`
    ${childStyleBase}
    ${props.style}
    ${props.isRedBold ? redBold : undefined}
  `

  return (
    <div onClick={props.onClick} className={containerStyle}>
      <span className={childStyle}>
        {props.children}
      </span>
    </div >
  )
}

export default ModalMenuItem;