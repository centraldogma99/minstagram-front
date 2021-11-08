import React, { useContext } from "react"
import { Modal, Box, Divider, Dialog } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import { Link } from "react-router-dom"
import DeletePostModal from "./DeletePostModal";
import { useState } from "react";
import { useEffect } from "react";
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

const redBoldStyle = {
  fontWeight: 'bold',
  color: 'red'
}

const PostMenuModal = (props: { open: boolean, onClose: any, isAuthor: boolean }) => {
  const [showDelete, setShowDelete] = React.useState(false);

  const [open, setOpen] = useState<boolean>(false)
  const { post } = useContext(PostContext);

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  return (
    <Modal
      open={open}
      onClose={props.onClose}
    >
      <Box sx={style as any}>
        <DeletePostModal
          open={showDelete}
          onClose={() => {
            setOpen(false);
            setShowDelete(false);
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
        <Link to={`/posts/${post._id}`}>
          <ModalMenuItem>
            게시물로 이동
          </ModalMenuItem>
        </Link>
      </Box>
    </Modal>
  )
}

export default PostMenuModal