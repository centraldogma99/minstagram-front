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
  // buttons: (typeof ModalMenuItem)[]j,
  children: any
}) => {
  const { onClose, title, message } = props;

  return (
    <MinstagramModal open={props.open} onClose={onClose} title={title}>
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