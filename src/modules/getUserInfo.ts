import axios from "axios";
const backServer = process.env.REACT_APP_backServer;

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
  return {
    avatar: res.data.avatar,
    name: res.data.name,
    _id: res.data._id
  }
}

export default getUserInfo;