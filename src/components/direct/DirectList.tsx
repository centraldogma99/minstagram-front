import React, { useLayoutEffect, useContext, useState, useEffect } from "react";
import { Box } from "@mui/system";
import { backServer } from "../../configs/env";
import axios from "axios";
import AuthContext from "../../context/authContext";
import { IDirectRoom } from "../../types/directs";
import { ListItemText, ListItem } from "@mui/material";
import DirectMessages from "./DirectMessages";
import Direct from "./Direct";
import { IUser } from "../../types/postTypes";
import { css } from "@emotion/css"

const DirectWrapper = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

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
        console.log(res.data);
        setDirects((res as any).data);
      });
  }, [user])

  const renderItems = (direct: IDirectRoom, index: number) => {
    const friend = direct.members.filter(member => member._id !== user._id)[0];
    let meIndex = -1;
    for (let i = 0; i < direct.members.length; i++) {
      if (direct.members[i]._id === user._id) {
        meIndex = i;
      }
    }
    const unreads = direct.messages.length - direct.bookmarks[meIndex] - 1;

    return (
      <ListItem>
        <ListItemText primary={`${friend.name} ${unreads}개 메시지`} key={index} onClick={onClickDirect(index)} />
      </ListItem>
    )
  }

  const onClickDirect = (index: number) => {
    return () => {
      setSelected(index);
      axios.post(`${backServer}/directs/updateBookmark`, { roomId: directs[index]._id, userId: user._id })
    }
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
      messages: [],
      bookmarks: [0, 0]
    }
    setDirects(prev => [...prev, direct])
  }

  return (
    <div className={DirectWrapper}>
      <div>
        <Box>
          {directs.map((direct, i) => renderItems(direct, i))}
        </Box>
        <input type="text" value={newDirectUser} onChange={(e) => setNewDirectUser(e.target.value)} />
        <input type="button" onClick={newDirect} value="시작" />
      </div>

      {selected != null && <Direct users={directs[selected].members} />}
    </div>
  )
}

export default DirectList;