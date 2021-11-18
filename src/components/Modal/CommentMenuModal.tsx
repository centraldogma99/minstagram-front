import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import DeleteConfirmModal from './DeleteConfirmModal'
import MessageAndButtonsModal from './MessageAndButtonsModal'
import ModalMenuItem from './ModalMenuItem'
import { Divider } from '@mui/material'

const CommentMenuModal = (props: { open: boolean, onClose: () => void, index: number, isAuthor?: boolean, width?: string }) => {
  const [open, setOpen] = useState<boolean>(props.open);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const onClickDelete = () => {
    setConfirmModalOpen(true);
  }

  return (
    <MessageAndButtonsModal
      open={open}
      onClose={() => {
        setOpen(false);
        props.onClose();
      }}
      width={props.width}
    >
      {props.isAuthor &&
        <>
          <DeleteConfirmModal
            open={confirmModalOpen}
            onClose={() => {
              setConfirmModalOpen(false);
              setOpen(false);
              props.onClose();
            }}
            isComment={true}
            commentIndex={props.index}
          />
          <ModalMenuItem onClick={onClickDelete} isRedBold={true}>
            삭제
          </ModalMenuItem>
          <Divider />
        </>
      }
      <ModalMenuItem>
        아무한테나 뜨는 항목
      </ModalMenuItem>
      <Divider />
      <ModalMenuItem isRedBold={true}>
        기능은 없지만 강조
      </ModalMenuItem>
    </MessageAndButtonsModal >
  )
}

export default CommentMenuModal