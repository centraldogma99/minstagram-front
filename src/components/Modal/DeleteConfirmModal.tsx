import React from "react"
import { Divider } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import * as deletePostAPI from "../../modules/deletePost";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../context/postContext";
import MessageAndButtonsModal from "./MessageAndButtonsModal";
import ToastContext from "../../context/ToastContext";
import axios from "axios";
import { backServer } from "../../configs/env";

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}


const DeleteConfirmModal = (props: { open: boolean, onClose: any, isComment?: boolean, commentIndex?: number }) => {
  const [open, setOpen] = useState(props.open);
  const { post, deletePost } = useContext(PostContext);
  const { setToastMessage, setToastOpen } = useContext(ToastContext);

  const deleteComment = (index: number | string) => {
    axios.delete(`${backServer}/posts/${post._id}/comment/${index}`, { withCredentials: true })
  }

  const whatIsMe = props.isComment ? '댓글' : '게시물';

  useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  const onDeleteClick = () => {
    if (!props.isComment) {
      // 백과 통신
      deletePostAPI.default(post._id);
      // 프론트에서 지우기
      deletePost();
    } else {
      deleteComment(props.commentIndex as number);
    }

    setOpen(false);
    props.onClose()
    setToastMessage(`${whatIsMe}이 삭제되었습니다.`);
    setToastOpen(true);
  }

  const onClickCancel = () => {
    setOpen(false);
    props.onClose();
  }

  return (
    <MessageAndButtonsModal
      open={open}
      onClose={() => { props.onClose(); setOpen(false); }}
      message={`${whatIsMe}을 삭제하시겠어요?`}
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

export default DeleteConfirmModal