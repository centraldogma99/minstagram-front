import React from "react"

const style = {
  position: "relative",
  height: "2.5em",
  fontSize: "0.9em"
  // position: "absolute",
  // top: "50%",
  // transform: "translateY(-50%)"
}

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
}

const ModalMenuItem = (props: { onClick?: () => void, style?: any, children: any }) => {
  const childStyle = { ...style2, ...props.style }

  return (
    <div onClick={props.onClick} className="modal-menu-item-container" style={style as any}>
      <span className="modal-menu-item" style={childStyle}>
        {props.children}
      </span>
    </div >
  )
}

export default ModalMenuItem;