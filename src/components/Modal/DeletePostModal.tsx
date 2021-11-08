import React from "react"
import { Box, Modal, Divider } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import * as deletePostAPI from "../../modules/deletePost";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import PostContext from "../../context/postContext";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  padding: 0,
  borderRadius: "0.5em",
  outline: 'none'
};

const msgStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontWeight: 'bold'
}

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
    <Modal open={open} onClose={props.onClose}>
      <Box sx={style as any}>
        <div style={{ position: 'relative', height: "5em" }}>
          <span style={msgStyle as any}>이 게시물을 삭제하시겠어요?</span>
        </div>
        <Divider />
        <ModalMenuItem onClick={onDeleteClick} style={redBoldStyle}>
          삭제
        </ModalMenuItem>
        <Divider />
        <ModalMenuItem>
          취소
        </ModalMenuItem>
      </Box>
    </Modal>
  )
}

export default DeletePostModal