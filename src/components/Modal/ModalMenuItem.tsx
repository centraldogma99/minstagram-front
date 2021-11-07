import React from "react"

const ModalMenuItem = (props: { onClick?: () => void, children: any }) => {
  return (
    <div onClick={props.onClick} className="modal-menu-item">
      {props.children}
    </div>
  )
}

export default ModalMenuItem;