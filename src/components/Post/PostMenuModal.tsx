import React, { useContext } from "react"
import { Divider } from "@mui/material";
import ModalMenuItem from "../Modal/ModalMenuItem";
import { Link } from "react-router-dom"
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useState } from "react";
import PostContext from "../../context/postContext";
import MessageAndButtonsModal from "../Modal/MessageAndButtonsModal";
import NewPostModal from "../TopBar/NewPostModal";

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}

const PostMenuModal = (props: { open: boolean, onClose: () => void, isAuthor: boolean, width?: string }) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { post } = useContext(PostContext)

  return (
    <MessageAndButtonsModal
      open={props.open}
      onClose={props.onClose}
      width={props.width}
    >
      <DeleteConfirmModal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          props.onClose();
        }}
      />
      <NewPostModal
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
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
      <Link to={`/posts/${post._id}`} onClick={props.onClose}>
        <ModalMenuItem>
          게시물로 이동
        </ModalMenuItem>
      </Link>
    </MessageAndButtonsModal >
  )
}

export default PostMenuModal