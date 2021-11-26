import React, { useLayoutEffect, useState } from "react";
import { IPost, IUser } from "../../types/postTypes"
import { backServer } from "../../configs/env";
import axios from "axios"
import styled from "styled-components";
import Profile from "../Profile";
import { useParams } from "react-router-dom";
import { css } from '@emotion/css'
import ChangeAvatarModal from "../Modal/ChangeAvatarModal";
import PostViewModal from "../Modal/PostViewModal";
import { Divider } from "@mui/material";
import WrongLink from "../Error/WrongLink";
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileEditModal from "../Modal/ProfileEditModal";
import { useContext } from "react";
import AuthContext from "../../context/authContext";

const ContentWrapperCentered = styled.div`
  padding-top: 4em;
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
  margin-top: 2em;
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
  display: flex;
  flex-direction: row;
  `

const UserDetailsContainer = css`
  display: flex;
  flex-direction: column;
  margin-left: 3em;
  text-align: left;
`

const thumbnailContainer = css`
  width: 24%;
  padding-top: 25%; /* 1:1 Aspect Ratio */
  position: relative;
  margin: 0.5%;
`

const Mypage = (props: { userName?: string }) => {
  const { user: me } = useContext(AuthContext);
  // react router로 param을 받거나 props로 userName을 받는다.
  const { userNameParam } = useParams<{ userNameParam: string }>();
  const userName = props.userName || userNameParam;
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser>()
  const [profile, setProfile] = useState<{ bio: string, name: string }>();

  const [changeAvatarOpen, setChangeAvatarOpen] = useState(false);
  const [postViewOpen, setPostViewOpen] = useState(false);
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);

  const [currentPost, setCurrentPost] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // FIXME: res typed any
  // load user info/posts
  useLayoutEffect(() => {
    async function fetchPosts() {
      const res: any = await axios.get(`${backServer}/users/name`, {
        params: {
          name: userName
        }
      }).catch(e => e.response)
      setIsFetching(false);
      if (res.status === 404) {
        return;
      }
      setUser(res.data);

      const posts = await getPosts(res.data._id);
      const profile = await getProfile(res.data._id);


      setPosts(posts);
      setProfile(profile);
    }
    fetchPosts();
  }, [props.userName, userNameParam]);

  const getPosts = async (id: string): Promise<IPost[]> => {
    if (!id) throw Error("no id given");
    const posts: any = await axios.get(`${backServer}/users/${id}/posts`, { withCredentials: true });
    return posts.data
  }

  const getProfile = async (id: string): Promise<{ bio: string, name: string }> => {
    if (!id) throw Error("no id given");
    const res: any = await axios.get(`${backServer}/users/${id}/profile`);
    return res.data;
  }

  const renderPost = (post: IPost, i: number) => {
    return (
      <div key={post._id} className={thumbnailContainer}>
        <PostThumbnail
          src={backServer + '/images/' + post.pictures[0]}
          alt="a"
          onClick={() => {
            setCurrentPost(i);
            setPostViewOpen(true);
          }} />
      </div>
    )
  }

  // useLayoutEffect에서 user를 만들기 때문에 type assertion 했다.
  return (
    <>
      {(!isFetching && !user) && <WrongLink />}
      {!isFetching && user && profile &&
        <ContentWrapperCentered>
          <ChangeAvatarModal
            open={changeAvatarOpen}
            onClose={() => setChangeAvatarOpen(false)}
          />
          <PostViewModal
            open={postViewOpen}
            onClose={() => setPostViewOpen(false)}
            post={posts[currentPost]}
          />
          <ProfileEditModal
            open={changeProfileOpen}
            onClose={() => setChangeProfileOpen(false)}
            bio={profile?.bio ?? ""}
          />
          <div className={UserProfileContainer}>
            <div onClick={() => setChangeAvatarOpen(true)}>
              <Profile user={user} imageStyle={css`width: 10em; height: 10em;`} nameHide />
            </div>
            <div className={UserDetailsContainer}>
              <div className={css`display: flex; flex-direction: row; align-items: center;`}>
                <Profile user={user} nameStyle={css`font-size: 2.5em; font-weight: 250;`} avatarHide style={css`margin-right: 1em;`} />
                {userName === me.name && <SettingsIcon onClick={() => setChangeProfileOpen(true)} />}
              </div>
              <div className={css`padding-top: 1.3em; padding-bottom: 1.3em;`}>
                게시물 <b>{posts.length}</b>
              </div>
              <div className={css`flex: 1;`}>
                {profile?.bio}
              </div>
            </div>
          </div>
          <Divider />
          <Posts>
            {posts?.length === 0 && <span className={css`font-size: 1.3em;`}>아직 아무 것도 올리지 않았어요.</span>}
            {posts?.length > 0 && posts.map(renderPost)}
          </Posts>
        </ContentWrapperCentered>
      }
    </>
  )
}

export default Mypage;