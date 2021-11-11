import React from "react"
import { Divider, Snackbar } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import * as deletePostAPI from "../../modules/deletePost";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../context/postContext";
import MessageAndButtonsModal from "./MessageAndButtonsModal";
import ToastContext from "../../context/ToastContext";

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}

const DeletePostModal = (props: { open: boolean, onClose: any }) => {
  const [open, setOpen] = useState(props.open);
  const { post, deletePost } = useContext(PostContext);
  const { setToastMessage, setToastOpen } = useContext(ToastContext);
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
    setToastMessage("포스트가 삭제되었습니다.");
    setToastOpen(true);
  }

  const onClickCancel = () => {
    setOpen(false);
    props.onClose();
  }

  return (
    <MessageAndButtonsModal
      open={open}
      onClose={props.onClose}
      message={"이 게시물을 삭제하시겠어요?"}
      width="24em"
    >
      <ModalMenuItem onClick={onDeleteClick} style={redBoldStyle}>
        삭제
      </ModalMenuItem>
      <Divider />
      <ModalMenuItem onClick={onClickCancel}>
        취소
      </ModalMenuItem>

    </MessageAndButtonsModal>
  )
}

export default DeletePostModal