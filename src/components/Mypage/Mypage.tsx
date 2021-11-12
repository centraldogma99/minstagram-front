import React, { useLayoutEffect, useState, useContext } from "react";
import { IPost, IUser } from "../../types/postTypes"
import { backServer } from "../../configs/env";
import axios from "axios"
import styled from "styled-components";
import Profile from "../Profile";
import { useParams, Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { css } from '@emotion/css'
import ChangeAvatarModal from "../Modal/ChangeAvatarModal";

const ContentWrapperCentered = styled.div`
  justify-content: center;
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  `

const Posts = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* width: 100%;
  height: 100%; */
  max-width: 100%;
`

const PostThumbnail = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  /* margin: 0.3em; */
  /* margin-left: auto;
  margin-right: auto; */
  object-fit: cover;
`

const UserProfileContainer = css`
  padding-top: 3em;
  margin-bottom: 3em;
  `

const thumbnailContainer = css`
  width: 24%;
  padding-top: 25%; /* 1:1 Aspect Ratio */
  position: relative;
  margin: 0.5%;
`

const Mypage = (props: { userName?: string }) => {
  // react router로 param을 받거나 props로 userName을 받는다.
  const { userNameParam } = useParams<{ userNameParam: string }>();
  const userName = props.userName || userNameParam;
  // const [user, setUser] = useState<IUser>({ _id: "", name: "", avatar: "", email: "" });
  const [posts, setPosts] = useState<IPost[]>([]);
  const { user, setUser } = useContext(AuthContext);
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);

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
      <div key={post._id} className={thumbnailContainer}>
        <Link to={`/posts/${post._id}`}>
          <PostThumbnail src={backServer + '/images/' + post.pictures[0]} />
        </Link>
      </div>
    )
  }

  // useLayoutEffect에서 user를 만들기 때문에 type assertion 했다.
  return (
    <ContentWrapperCentered>
      <ChangeAvatarModal
        open={changeProfileOpen}
        onClose={() => setChangeProfileOpen(false)}
      />
      <div className={UserProfileContainer}>
        <div onClick={() => setChangeProfileOpen(true)}>
          <Profile user={user} imageWidth="7em" nameFontSize="2.5em" />
          {/* <UserProfile>
          <Avatar src={backServer + "/images/" + user.avatar} />
          <Name>{user.name}</Name>
        </UserProfile> */}
        </div>
      </div>

      <Posts>
        {posts?.length === 0 && <div>포스트가 없습니다!</div>}
        {posts?.length > 0 && posts.map(renderPost)}
      </Posts>
    </ContentWrapperCentered>
  )
}

export default Mypage;