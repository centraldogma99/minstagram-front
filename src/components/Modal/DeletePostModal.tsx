import React from "react"
import { Box, Modal, Divider } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import * as deletePostAPI from "../../modules/deletePost";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../context/postContext";
import styled from '@emotion/styled'
import MessageAndButtonsModal from "./MessageAndButtonsModal";

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}

const DeletePostModal = (props: { open: boolean, onClose: any }) => {
  const [open, setOpen] = useState(props.open);
  const { post, deletePost } = useContext(PostContext)
  const history = useHistory();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  const onDeleteClick = () => {
    // 백과 통신
    deletePostAPI.default(post._id);
    // 프론트에서 지우기
    deletePost();
    history.push("/")

    setOpen(false);
    props.onClose()
  }

  return (
    <MessageAndButtonsModal
      open={open}
      onClose={props.onClose}
      message={"이 게시물을 삭제하시겠어요?"}
    >
      <ModalMenuItem onClick={onDeleteClick} style={redBoldStyle}>
        삭제
      </ModalMenuItem>
      <Divider />
      <ModalMenuItem>
        취소
      </ModalMenuItem>
    </MessageAndButtonsModal>
  )
}

export default DeletePostModal