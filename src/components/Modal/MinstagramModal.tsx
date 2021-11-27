import { Divider, Modal, Box } from "@mui/material"
import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/css"

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

const FormModalNextButton = styled.a<{ inactive?: boolean }>`
  position: absolute;
  font-size: 0.9em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.inactive ? 'lightblue' : 'dodgerblue'};
  pointer-events: ${props => props.inactive ? 'none' : undefined};
`

const MinstagramModal = (props: {
  open: boolean,
  onClose: () => void,
  title?: string,
  width?: string,
  height?: string,
  next?: {
    text: string,
    onClick: () => void
  }
  nextInactive?: boolean,
  children: any
}) => {
  const ContainerStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props.width ?? '28em'};
    height: ${props.height};
    background-color: white;
    box-shadow: 24;
    padding: 0;
    border-radius: 0.4em;
    outline: none;
    max-height: 75%;
  `
  // const style = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: props.width ?? '28em',
  //   height: props.height,
  //   bgcolor: 'white',
  //   boxShadow: 24,
  //   // p: 4,
  //   // padding: 0,
  //   borderRadius: "0.4em",
  //   outline: 'none',
  //   maxHeight: '75%'
  // }

  const FormModalChlidContainer = css`
    height: ${props.title ? "calc(100% - 2.5em)" : "100%"};
  `;

  return (<>
    <Modal open={props.open} onClose={props.onClose}>
      <Box className={ContainerStyle}>
        {props.title && <>
          <FormModalTitleContainer>
            <FormModalTitle>
              {props.title}
            </FormModalTitle>
            <FormModalNextButtonContainer>
              {props.next &&
                <FormModalNextButton onClick={props.nextInactive ? undefined : props.next.onClick} inactive={props.nextInactive}>
                  {props.next.text}
                </FormModalNextButton>
              }
            </FormModalNextButtonContainer>
          </FormModalTitleContainer>
          <Divider />
        </>}
        <div className={FormModalChlidContainer}>
          {props.children}
        </div>
      </Box>
    </Modal>
  </>)
}

export default MinstagramModal;