import { useEffect, useState } from "react";
import getUserInfo from "../modules/getUserInfo";


const useProfile = (id?: string) => {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");

  // useEffect(() => {
  //   getUserInfo(id)
  //     .then((profile) => {
  // setImage(profile.image);
  //       setName(profile.name);
  //     })
  // }, [id]);

  return { image, name }
}

export default useProfile;