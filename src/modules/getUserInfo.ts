import axios from "axios";
import { backServer } from "../configs/env"

const getUserInfo = async (id?: string) => {
  console.log('getUserInfo')
  let res: any;
  if (!id) {
    console.log('me')
    res = await axios.get(`${backServer}/users/me`,
      { withCredentials: true }
    );
  } else {
    res = await axios.get(`${backServer}/users/${id}`)
  }

  return {
    avatar: res.data.avatar,
    name: res.data.name,
    _id: res.data.id
  }
}

export default getUserInfo;