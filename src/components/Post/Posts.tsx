import React from "react";
import styled from "styled-components";
import Profile from "../Profile";
import PicturesView from "./PicturesView"
import { IPost } from "../../types/postTypes"
import Likes from "./Likes"
import Comments from "./Comments"

const PostTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Posts = (props: { posts: IPost[] }) => {
  const renderPost = (post: IPost) => {
    return (
      <div className="post">
        <PostTopBar>
          <Profile userId={post.authorId} />
        </PostTopBar>
        <PicturesView pictures={post.pictures} />
        <Likes likes={post.likes} />
        <Comments comments={post.comments} />
      </div>
    );
  }

  return (
    <div className="posts">
      {props.posts.map(post => renderPost(post))}
    </div>
  )
}


export default Posts;