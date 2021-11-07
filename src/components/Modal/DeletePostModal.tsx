import React from "react"
import { Box, Modal } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import deletePost from "../../modules/deletePost";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  padding: 0,
};

const DeletePostModal = (props: { open: boolean, onClose: any, _id: string }) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={style as any}>
        <div>
          이 게시물을 삭제하시겠어요?
        </div>
        <ModalMenuItem onClick={() => deletePost(props._id)}>
          삭제
        </ModalMenuItem>
        <ModalMenuItem>
          취소
        </ModalMenuItem>
      </Box>
    </Modal>
  )
}

export default DeletePostModal