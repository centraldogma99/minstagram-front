import { backServer } from "../configs/env";
import axios from "axios";

const getPost = (_id: string) => {
  return axios.get(`${backServer}/posts/${_id}`)
}

export default getPost;