import React from "react"
import { Modal, Box } from "@mui/material";
import ModalMenuItem from "./ModalMenuItem";
import { Link } from "react-router-dom"
import DeletePostModal from "./DeletePostModal";

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

const PostMenuModal = (props: { open: boolean, onClose: any, _id: string, text: string, isAuthor: boolean }) => {
  const [showDelete, setShowDelete] = React.useState(false);

  const handleClick = (setState: (v: boolean) => void) => { return () => setState(true) };
  const handleClose = (setState: (v: boolean) => void) => { return () => setState(false) };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <Box sx={style as any}>
        <DeletePostModal
          open={showDelete}
          onClose={() => {
            handleClose(setShowDelete)()
            props.onClose()
          }}
          _id={props._id}
        />
        {props.isAuthor && <>
          <Link to={{
            pathname: `/posts/${props._id}/edit`,
            state: { text: props.text }
          }}>
            <ModalMenuItem>
              수정
            </ModalMenuItem>
          </Link>
          <ModalMenuItem onClick={handleClick(setShowDelete)}>
            삭제
          </ModalMenuItem>
        </>}
        <Link to={`/posts/${props._id}`}>
          <ModalMenuItem>
            게시물로 이동
          </ModalMenuItem>
        </Link>
      </Box>
    </Modal>
  )
}

export default PostMenuModal