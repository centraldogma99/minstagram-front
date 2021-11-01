import React, { useLayoutEffect, useState } from "react";
import { IPost, IUser } from "../../types/postTypes"
import { backServer } from "../../configs/env";
import axios from "axios"
import styled from "styled-components";
import Profile from "../Profile";
import { useParams } from "react-router-dom";

const Posts = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Mypage = (props: { userName?: string }) => {
  // react router로 param을 받거나 props로 userName을 받는다.
  const { userNameParam } = useParams<{ userNameParam: string }>();
  const userName = props.userName || userNameParam;
  const [user, setUser] = useState<IUser>();
  const [posts, setPosts] = useState<IPost[]>([]);

  // FIXME: res typed any
  // load user info/posts
  useLayoutEffect(() => {
    async function fetchPosts() {
      const res: any = await axios.get(`${backServer}/users/name/${userName}`)
      setUser(res.data);
      const posts = await getPosts(res.data._id);
      setPosts(posts);
    }
    fetchPosts();
  }, [props.userName, userNameParam]);

  const getPosts = async (id: string): Promise<IPost[]> => {
    if (!id) throw Error("no id given");
    const posts: any = await axios.get(`${backServer}/users/${id}/posts`);
    return posts.data
  }

  const renderPost = (post: IPost) => {
    return (
      <div key={post._id}>
        <img src={backServer + '/images/' + post.pictures[0]} />
      </div>
    )
  }

  // useLayoutEffect에서 user를 만들기 때문에 type assertion 했다.
  return (
    <div className="mypage">
      <Profile user={user as IUser} />
      <Posts>
        {posts.map(renderPost)}
      </Posts>
    </div>
  )
}

export default Mypage;