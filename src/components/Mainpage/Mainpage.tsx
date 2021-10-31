import React, { useState } from "react";
import TopBar from "../TopBar/TopBar";
import Posts from "../Post/Posts";
import blackpink from "../../assets/blackpink.jpeg";
import NewPost from "../Post/NewPost";
import ChangeProfile from "../Mypage/ChangeProfile";

const posts = [
  {
    _id: "1",
    authorName: "dogma",
    pictures: [blackpink],
    likes: [
      {
        authorName: "dogma"
      },
      {
        authorName: "dogma2"
      }
    ],
    comments: [
      {
        authorName: "1234",
        content: "매우 좋은 포스트에요",
        likes: []
      },
      {
        authorName: "1235",
        content: "동의합니다.",
        likes: []
      },
    ]
  }
]

const Mainpage = () => {
  // 아래 내용이 무엇이 들어갈지
  const [content, setContent] = useState<"dm" | "newPost" | "posts" | "changeProfile">("posts");

  return (
    <div id="main">
      <header>
        <TopBar setContent={setContent} />
      </header>
      {content === "posts" && <Posts />}
      {content === "newPost" && <NewPost />}
      {content === "changeProfile" && <ChangeProfile />}
    </div>
  )
}

export default Mainpage