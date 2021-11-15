import { Divider, Modal, Box } from "@mui/material"
import React from "react"
import styled from "@emotion/styled"
import { useEffect } from "react"
import { css } from "@emotion/css"

const ModalStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400;
  background-color: ${'background.paper'};
  box-shadow: 24;
  p: 4;
  padding: 0;
  border-radius: 0.5em;
  outline: none;
`

const FormModalTitleContainer = styled.div`
  font-weight: bold;
  height: 2.5em;
  position: relative;
`

const FormModalTitle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const FormModalNextButtonContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate(-2.6em, -50%);
`

const FormModalNextButton = styled.a`
  position: absolute;
  font-size: 0.9em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: dodgerblue;
`

const FormModalChlidContainer = styled.div`
`;

const MinstagramModal = (props: {
  open: boolean,
  onClose: () => void,
  title?: string,
  width?: string,
  next?: {
    text: string,
    onClick: () => void
  }
  children: any
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: props.width ?? '28em',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    padding: 0,
    borderRadius: "0.5em",
    outline: 'none',
    maxHeight: '80%'
  }

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  return (<>
    <Modal open={open} onClose={() => {
      setOpen(false);
      props.onClose()
    }}>
      <Box sx={style as any}>
        {props.title && <>
          <FormModalTitleContainer>
            <FormModalTitle>
              {props.title}
            </FormModalTitle>
            <FormModalNextButtonContainer>
              <FormModalNextButton onClick={props.next?.onClick} >
                {props.next?.text}
              </FormModalNextButton>
            </FormModalNextButtonContainer>
          </FormModalTitleContainer>
          <Divider />
        </>}

        <div>
          {props.children}
        </div>
      </Box>
    </Modal>
  </>)
}

export default MinstagramModal;