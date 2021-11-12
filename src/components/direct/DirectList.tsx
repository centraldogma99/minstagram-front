import React, { useLayoutEffect, useContext, useState } from "react";
import { Box } from "@mui/system";
import { backServer } from "../../configs/env";
import axios from "axios";
import AuthContext from "../../context/authContext";
import { IDirectRoom } from "../../types/directs";
import { ListItemText, ListItem } from "@mui/material";
import DirectMessages from "./DirectMessages";
import Direct from "./Direct";
import { IUser } from "../../types/postTypes";

const DirectList = () => {
  const { user } = useContext(AuthContext);
  const [directs, setDirects] = useState<IDirectRoom[]>([]);
  const [selected, setSelected] = useState<number>();
  const [newDirectUser, setNewDirectUser] = useState<string>("");

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

  const renderItems = (direct: IDirectRoom, index: number) => {
    const friend = direct.members.filter(member => member._id !== user._id)[0];
    return (
      <ListItem>
        <ListItemText primary={friend.name} key={index} onClick={() => setSelected(index)} />
      </ListItem>
    )
  }

  const newDirect = async () => {
    const opponent = await axios.get(`${backServer}/users/name`,
      {
        params: {
          name: newDirectUser
        }
      })

    const users = [user, opponent.data as IUser]
    const res = await axios.post(`${backServer}/directs/newRoom`, { members: users })
    const direct = {
      _id: res.data as string,
      members: users,
      messages: []
    }
    setDirects(prev => [...prev, direct])
  }

  return (
    <>
      <Box>
        {directs.map((direct, i) => renderItems(direct, i))}
      </Box>
      <input type="text" value={newDirectUser} onChange={(e) => setNewDirectUser(e.target.value)} />
      <input type="button" onClick={newDirect} value="시작" />
      {selected && <Direct users={directs[selected].members} />}
    </>
  )
}

export default DirectList;