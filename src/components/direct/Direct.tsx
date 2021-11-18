import React from "react"
import { IUser } from "../../types/postTypes";
import DirectMessages from "./DirectMessages";
import { IDirectMessage, IDirectRoom } from "../../types/directs";
import CommentForm from "../Post/CommentForm";
import { useState, useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import { backServer } from "../../configs/env";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import AuthContext from "../../context/authContext";


const Direct = (props: { users: IUser[] }) => {
  const { users } = props;

  const [direct, setDirect] = useState<IDirectRoom | null>(null);
  const [socket, setSocket] = useState<any>();
  const [text, setText] = useState<string>("");
  const { user } = useContext(AuthContext);

  const newMessage = (msg: IDirectMessage) => {
    setDirect(prev => {
      if (!prev) return null;
      const { messages, ...rest } = prev;
      return { messages: [...messages, msg], ...rest };
    })
  }

  //
  // direct 객체 서버에서 받아오기
  //
  useEffect(() => {
    const a = async () => {
      try {
        const res: any = await axios.get(`${backServer}/directs/withUsers`,
          {
            params: {
              userId1: users[0]._id,
              userId2: users[1]._id
            }
          })
        setDirect(res.data[0] as IDirectRoom)
      } catch (e) {
        console.log(e)
        try {
          const res = await axios.post(`${backServer}/directs/newRoom`,
            users.map(user => user._id)
          )
          setDirect({
            _id: res.data as string,
            members: users,
            messages: [],
            bookmarks: [0, 0]
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
    a();
  }, [])

  //
  // socket 만들기
  //
  useEffect(() => {
    if (direct === null) return;
    const socket = io(backServer);

    socket.on("connect", () => {
      socket.emit("join", direct._id, Cookies.get('credential'))
    })

    socket.on("messageEvent", newMessage);

    setSocket(socket);

    return () => {
      socket.off("messageEvent", newMessage);
      socket.disconnect();
    }
  }, [direct?.members])

  // 텍스트 창 비우고, direct state 갱신 및 서버 통신
  const onSubmitMessage = () => {
    const msg = {
      author: user,
      content: text,
      timestamp: new Date()
    }
    // newMessage(msg);
    if (socket) socket.emit("messageEvent", msg);
    setText("")
  }

  return (
    <div>
      {direct && <DirectMessages direct={direct} />}
      <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <input type="button" value="보내기" onClick={onSubmitMessage} />
      </div>
      {/* <CommentForm onSubmit={onSubmitMessage} /> */}
    </div>
  )
}

export default Direct;