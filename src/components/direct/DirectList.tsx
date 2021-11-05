import React, { useLayoutEffect, useContext, useState } from "react";
import { Box } from "@mui/system";
import { backServer } from "../../configs/env";
import axios from "axios";
import AuthContext from "../../context/authContext";
import { IDirectRoom } from "../../types/directs";
import { ListItemText, ListItem } from "@mui/material";
import DirectMessages from "./DirectMessages";

const DirectList = () => {
  const { user } = useContext(AuthContext);
  const [directs, setDirects] = useState<IDirectRoom[]>([]);
  const [selected, setSelected] = useState<number>();

  useLayoutEffect(() => {
    axios.get(`${backServer}/directs/withUsers`,
      {
        params: {
          userId1: user._id
        }
      }).then(res => {
        setDirects((res as any).data);
      });
  }, [user])

  const renderItems = (direct: IDirectRoom) => {
    const friend = direct.members.filter(member => member._id !== user._id)[0];
    return (
      <ListItem>
        <ListItemText primary={friend.name} />
      </ListItem>
    )
  }

  return (
    <>
      <Box>
        {directs.map(direct => renderItems(direct))}
      </Box>
      <DirectMessages direct={selected ? directs[selected] : undefined} />
    </>
  )
}

export default DirectList;