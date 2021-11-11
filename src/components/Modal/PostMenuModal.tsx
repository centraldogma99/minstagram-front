import React, { useContext } from "react"
import { Modal, Box, Divider, Dialog } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import { Link } from "react-router-dom"
import DeletePostModal from "./DeletePostModal";
import { useState } from "react";
import { useEffect } from "react";
import PostContext from "../../context/postContext";
import MessageAndButtonsModal from "./MessageAndButtonsModal";
import ToastContext from "../../context/ToastContext";

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}

const PostMenuModal = (props: { open: boolean, onClose: any, isAuthor: boolean, width?: string }) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const [open, setOpen] = useState<boolean>(false)
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
      <DeletePostModal
        open={showDelete}
        onClose={() => {
          setOpen(false);
          setShowDelete(false);
          props.onClose();
        }}
      />
      {props.isAuthor && <>
        <Link to={{
          pathname: `/posts/${post._id}/edit`,
          state: { text: post.text }
        }}>
          <ModalMenuItem>
            수정
          </ModalMenuItem>
        </Link>
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