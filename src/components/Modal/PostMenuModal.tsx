import React, { useContext } from "react"
import { Modal, Box, Divider, Dialog } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import { Link } from "react-router-dom"
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useState } from "react";
import { useEffect } from "react";
import PostContext from "../../context/postContext";
import MessageAndButtonsModal from "./MessageAndButtonsModal";
import ToastContext from "../../context/ToastContext";
import NewPostModal from "./NewPostModal";

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}

const PostMenuModal = (props: { open: boolean, onClose: any, isAuthor: boolean, width?: string }) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { post } = useContext(PostContext)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  return (
    <MessageAndButtonsModal
      open={open}
      onClose={() => {
        setOpen(false);
        setShowDelete(false);
        props.onClose();
      }}
      width={props.width}
    >
      <DeleteConfirmModal
        open={showDelete}
        onClose={() => {
          setOpen(false);
          setShowDelete(false);
          props.onClose();
        }}
      />
      <NewPostModal
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          setOpen(false);
          props.onClose();
        }}
        originalPost={post}
      />
      {props.isAuthor && <>
        <ModalMenuItem onClick={() => setShowEdit(true)}>
          수정
        </ModalMenuItem>
        <Divider />
        <ModalMenuItem onClick={() => setShowDelete(true)} style={redBoldStyle}>
          삭제
        </ModalMenuItem>
        <Divider />
      </>}
      <Link to={`/posts/${post._id}`} onClick={() => setOpen(false)}>
        <ModalMenuItem>
          게시물로 이동
        </ModalMenuItem>
      </Link>
    </MessageAndButtonsModal >
  )
}

export default PostMenuModal