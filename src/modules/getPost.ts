const backServer = process.env.REACT_APP_backServer;
import axios from "axios";

const getPost = (_id: string) => {
  return axios.get(`${backServer}/posts/${_id}`)
}

export default getPost;