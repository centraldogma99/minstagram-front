import React from "react";
import MinstagramModal from "./MinstagramModal";
import Post from "../Post/Post";
import { IPost } from "../../types/postTypes";
import { css } from "@emotion/css"


const PostStyle = css`
  margin-bottom: 0;
  border: none;
`

const PostViewModal = (props: { open: boolean, onClose: () => void, post: IPost }) => {
  return (
    <MinstagramModal
      open={props.open}
      onClose={props.onClose}
      width={"none"}
    >
      <Post {...props.post} style={PostStyle} isModal={true} />
    </MinstagramModal >
  )
}

export default PostViewModal