import React from "react"
import { Divider } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import * as deletePostAPI from "../../modules/deletePost";
import { useContext } from "react";
import PostsContext from "../../context/PostsContext";
import PostContext from "../../context/postContext";
import MessageAndButtonsModal from "./MessageAndButtonsModal";
import ToastContext from "../../context/ToastContext";
import axios from "axios";
const backServer = process.env.REACT_APP_backServer;

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}


const DeleteConfirmModal = (props: { open: boolean, onClose: any, isComment?: boolean, commentIndex?: number }) => {
  const { post } = useContext(PostContext);
  const { deletePost } = useContext(PostsContext);
  const { setToastMessage, setToastOpen } = useContext(ToastContext);

  const deleteComment = (index: number | string) => {
    axios.delete(`${backServer}/posts/${post._id}/comment/${index}`, { withCredentials: true })
  }

  const whatIsMe = props.isComment ? '댓글' : '게시물';

  const onDeleteClick = () => {
    if (!props.isComment) {
      // 백과 통신
      deletePostAPI.default(post._id);
      // 프론트에서 지우기
      if (post.order != undefined) deletePost(post.order);
    } else {
      deleteComment(props.commentIndex as number);
    }
    props.onClose()
    setToastMessage(`${whatIsMe}이 삭제되었습니다.`);
    setToastOpen(true);
  }

  const onClickCancel = () => {
    props.onClose();
  }

  return (
    <MessageAndButtonsModal
      open={props.open}
      onClose={() => { props.onClose(); }}
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