import axios from "axios";
import { backServer } from "../configs/env"

const getUserInfo = async (id?: string) => {
  let res: any;
  if (!id) {
    res = await axios.get(`${backServer}/users/me`,
      { withCredentials: true }
    )
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } else {
    res = await axios.get(`${backServer}/users/${id}`)
  }
  console.log(res.data)
  return {
    avatar: res.data.avatar,
    name: res.data.name,
    _id: res.data.id
  }
}

export default getUserInfo;