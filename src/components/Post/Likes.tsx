import React from "react";
import { ILike } from "../../types/postTypes"
import Profile from "../Profile";

const Likes = (props: { likes: ILike[] }) => {
  return (
    <div className="likes">
      <Profile user={props.likes[0].author} />외 {props.likes.length - 1}명이 좋아합니다.
    </div>
  );
}

export default Likes;