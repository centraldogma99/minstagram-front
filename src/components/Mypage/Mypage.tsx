import React, { useLayoutEffect, useState, useContext } from "react";
import { IPost, IUser } from "../../types/postTypes"
import { backServer } from "../../configs/env";
import axios from "axios"
import styled from "styled-components";
import Profile from "../Profile";
import { useParams, Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/authContext";

const ContentWrapperCentered = styled.div`
  justify-content: center;
  max-width: 53em;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  `

const Posts = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`

const PostThumbnail = styled.img`
  width: 10em;
  height: 10em;
  margin: 0.3em;
  margin-left: auto;
  margin-right: auto;
`

const Avatar = styled.img`
  width: 5em;
  height: 5em;
  margin-left: auto;
  margin-right: 1em;
`

const Name = styled.span`
  font-size: 1.5em;
  margin-right: auto;
  font-weight: bold;
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 2em;
  `

const Mypage = (props: { userName?: string }) => {
  // react router로 param을 받거나 props로 userName을 받는다.
  const { userNameParam } = useParams<{ userNameParam: string }>();
  const userName = props.userName || userNameParam;
  const [user, setUser] = useState<IUser>({ _id: "", name: "", avatar: "", email: "" });
  const [posts, setPosts] = useState<IPost[]>([]);
  const { user: me } = useContext(AuthContext);
  console.log(useLocation());

  const ProfileChangeLink = ({ children, ...rest }: any) => {
    if (me._id === user._id) {
      return (
        <Link
          {...rest}
          to="/changeProfile"
        >
          {children}
        </Link>
      )
    } else {
      return children;
    }
  }

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
        <Link to={`/posts/${post._id}`}>
          <PostThumbnail src={backServer + '/images/' + post.pictures[0]} />
        </Link>
      </div>
    )
  }

  // useLayoutEffect에서 user를 만들기 때문에 type assertion 했다.
  return (
    <ContentWrapperCentered>
      <ProfileChangeLink>
        <UserProfile>
          <Avatar src={backServer + "/images/" + user.avatar} />
          <Name>{user.name}</Name>
        </UserProfile>
      </ProfileChangeLink>


      <Posts>
        {posts?.length === 0 && <div>포스트가 없습니다!</div>}
        {posts?.length > 0 && posts.map(renderPost)}
      </Posts>
    </ContentWrapperCentered>
  )
}

export default Mypage;