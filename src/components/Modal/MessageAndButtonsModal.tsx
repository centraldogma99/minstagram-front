import { Divider } from "@mui/material"
import React from "react"
import styled from "@emotion/styled"
import MinstagramModal from "./MinstagramModal"

const MessageContainer = styled.div`
  height: 7em;
  position: relative;
`

const Message = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
`

const MessageAndButtonsModal = (props: {
  open: boolean,
  onClose: () => void,
  title?: string,
  message?: string,
  width?: string,
  // buttons: (typeof ModalMenuItem)[]j,
  children: any
}) => {
  const { open, onClose, title, message } = props;

  return (
    <MinstagramModal open={open} onClose={onClose} title={title} width={props.width}>
      {message && <>
        <MessageContainer >
          <Message>{message}</Message>
        </MessageContainer>
        <Divider />
      </>}

      <div className="minstagram-modal-buttons">
        {props.children}
      </div>
    </MinstagramModal>
  )
}

export default MessageAndButtonsModal;