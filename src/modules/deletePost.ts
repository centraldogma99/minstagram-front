import { backServer } from "../configs/env";
import axios from "axios";

const deletePost = (_id: string) => {
  axios.delete(`${backServer}/posts/${_id}`, { withCredentials: true })
}

export default deletePost;