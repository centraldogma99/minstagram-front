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
  const [user, setUser] = useState<IUser>({} as IUser)
  // const { user, setUser } = useContext(AuthContext);
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);
  const [postViewOpen, setPostViewOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(true);


  // FIXME: res typed any
  // load user info/posts
  useLayoutEffect(() => {
    console.log('hi')
    async function fetchPosts() {
      const res: any = await axios.get(`${backServer}/users/name`, {
        params: {
          name: userName
        }
      })
      console.log(res)
      setUser(res.data);

      const posts = await getPosts(res.data._id);
      setIsFetching(false);
      setPosts(posts);
    }
    fetchPosts();
  }, [props.userName, userNameParam]);

  const getPosts = async (id: string): Promise<IPost[]> => {
    if (!id) throw Error("no id given");
    const posts: any = await axios.get(`${backServer}/users/${id}/posts`);
    return posts.data
  }

  const renderPost = (post: IPost, i: number) => {
    return (
      <div key={post._id} className={thumbnailContainer}>
        <PostThumbnail
          src={backServer + '/images/' + post.pictures[0]}
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
      {!isFetching &&
        <ContentWrapperCentered>
          <ChangeAvatarModal
            open={changeProfileOpen}
            onClose={() => setChangeProfileOpen(false)}
          />
          <PostViewModal
            open={postViewOpen}
            onClose={() => setPostViewOpen(false)}
            post={posts[currentPost]}
          />
          <div className={UserProfileContainer}>
            <div onClick={() => setChangeProfileOpen(true)}>
              <Profile user={user} imageWidth="7em" nameFontSize="2.5em" />
            </div>
          </div>

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