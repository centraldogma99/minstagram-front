import { useEffect, useState } from "react";
import logo from "./logo192.png"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakeAxios = async (id: string) => {
  return {
    image: logo,
    name: "dogma"
  }
}

const useProfile = (id: string) => {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fakeAxios(id)
      .then((profile) => {
        setImage(profile.image);
        setName(profile.name);
      })
  }, []);

  return { image, name }
}

export default useProfile;