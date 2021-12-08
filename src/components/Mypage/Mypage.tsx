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
import FollowButton from "./FollowButton";
import FollowListModal from "./FollowListModal";
import UnknownError from "../Error/UnknownError";

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
  cursor: pointer;
`

const UserStat = styled.div`
  margin-right: 3em;
  cursor: ${(props: { clickable?: boolean }) => props.clickable ? "pointer" : undefined};
`

const Mypage = (props: { userName?: string }) => {
  const { user: me } = useContext(AuthContext);
  // '내'가 이 유저를 팔로우 하는가?
  const [myFollows, setMyFollows] = useState<string[]>([])

  // react router로 param을 받거나 props로 userName을 받는다.
  const { userNameParam } = useParams<{ userNameParam: string }>();
  const userName = props.userName || userNameParam;

  // 이 유저의 팔로우/팔로잉/포스트/정보/프로필
  const [follows, setFollows] = useState<string[]>([])
  const [followers, setFollowers] = useState<string[]>([])
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser>()
  const [profile, setProfile] = useState<{ bio: string, name: string }>();

  // 모달 상태
  const [changeAvatarOpen, setChangeAvatarOpen] = useState(false);
  const [postViewOpen, setPostViewOpen] = useState(false);
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);
  const [followListOpen, setFollowListOpen] = useState(false);
  const [followerListOpen, setFollowerListOpen] = useState(false);

  // 포스트뷰 모달이 뭘 보고 있는지.
  const [currentPost, setCurrentPost] = useState<number>(0);

  // API 로딩 중인지?
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const [isError, setIsError] = useState<{ error: boolean, reason: string }>({ error: false, reason: "" });

  // FIXME: res typed any
  // load user info/posts
  useLayoutEffect(() => {
    async function fetchPosts() {
      // 페이지에 표시할 유저 정보 받아오기
      try {
        const res = await axios.get<IUser>(`${backServer}/users/name`, {
          params: {
            name: userName
          }
        })
        if (res instanceof Error) throw res;
        setIsFetching(false)

        const user = res.data;
        setUser(user);
        const posts = await getPosts(user._id);
        const profile = await getProfile(user._id);
        setPosts(posts);
        setProfile(profile);


        const myFollows = await axios.get<string[]>(`${backServer}/users/follow`, {
          params: {
            userId: me._id
          }
        }).then(res => res.data)
        setMyFollows(myFollows);

        if (user) {
          const follows = await axios.get<string[]>(`${backServer}/users/follow`, {
            params: {
              userId: user._id
            }
          }).then(res => res.data)
          setFollows(follows);
          const followers = await axios.get<string[]>(`${backServer}/users/follower`, {
            params: {
              userId: user._id
            }
          }).then(res => res.data)
          setFollowers(followers);
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 404) {
            setIsError({ error: true, reason: "404" })
            return;
          } else {
            setIsError({ error: true, reason: "" });
          }
        } else {
          setIsError({ error: true, reason: "" });
        }
      }
    }
    fetchPosts()
  }, [props.userName, userNameParam, me]);

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

  const onClickFollow = async () => {
    const isFollowing = myFollows.includes((user as IUser)._id);
    if (!isFollowing) {
      axios.post(`${backServer}/users/follow`,
        {
          followId: user?._id
        }, { withCredentials: true }
      )
      setMyFollows(prev => [...prev, (user as IUser)._id])
    } else {
      axios.post(`${backServer}/users/unfollow`,
        {
          followId: user?._id
        }, { withCredentials: true }
      )
      setMyFollows(prev => {
        const i = myFollows.indexOf((user as IUser)._id);
        return [...prev.slice(0, i), ...prev.slice(i + 1)]
      })
    }
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
      {(isError.error && isError.reason === "404") && <WrongLink />}
      {(isError.error && isError.reason === "") && <UnknownError />}
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
          <FollowListModal
            open={followListOpen}
            onClose={() => setFollowListOpen(false)}
            ids={follows}
            title="팔로우"
            width="23em"
          />
          <FollowListModal
            open={followerListOpen}
            onClose={() => setFollowerListOpen(false)}
            ids={followers}
            title="팔로워"
            width="23em"
          />
          <div className={UserProfileContainer}>
            <div onClick={() => setChangeAvatarOpen(true)}>
              <Profile user={user} imageStyle={css`width: 10em; height: 10em;`} nameHide />
            </div>
            <div className={UserDetailsContainer}>
              <div className={css`display: flex; flex-direction: row; align-items: center;`}>
                <Profile user={user}
                  nameStyle={css`font-size: 2.5em; font-weight: 250;`}
                  avatarHide
                  style={css`margin-right: 1em;`} />
                {userName != me.name &&
                  <FollowButton isFollowed={myFollows.includes(user._id)} onClick={onClickFollow} />
                }
                {userName === me.name &&
                  <SettingsIcon className={css`cursor: pointer;`} onClick={() => setChangeProfileOpen(true)} />
                }
              </div>
              <div className={css`padding-top: 1.3em; padding-bottom: 1.3em; display: flex; flex-direction: row;`}>
                <UserStat>
                  게시물 <b>{posts.length}</b>
                </UserStat>
                <UserStat clickable onClick={() => setFollowListOpen(true)}>
                  팔로우 <b>{follows.length}</b>
                </UserStat>
                <UserStat clickable onClick={() => setFollowerListOpen(true)}>
                  팔로워 <b>{followers.length}</b>
                </UserStat>
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
        </ContentWrapperCentered >
      }
    </>
  )
}

export default Mypage;