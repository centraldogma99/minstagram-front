import React from "react"
import { Modal } from "@mui/material"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const ModalWithMenu = (props: { open: boolean, onClose: () => void, children?: any }) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      {/* {props.children} */}
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Trash" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#simple-list">
            <ListItemText primary="Spam" />
          </ListItemButton>
        </ListItem>
      </List>
    </Modal>
  )
}

export default ModalWithMenu