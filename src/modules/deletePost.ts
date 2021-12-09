const backServer = process.env.REACT_APP_backServer;
import axios from "axios";

const deletePost = (_id: string) => {
  axios.delete(`${backServer}/posts/${_id}`, { withCredentials: true })
}

export default deletePost;