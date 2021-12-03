import React from "react"
import { css } from "@emotion/css"

const FollowButton = (props: { isFollowed: boolean, onClick: any }) => {
  const { isFollowed } = props;

  const followButton = css`
    width: 6em;
    border-radius: 3px;
    background-color: ${isFollowed ? 'transparent' : 'dodgerblue'};
    color: ${isFollowed ? 'black' : 'white'};
    height: 2.3em;
    border: ${isFollowed ? 'gainsboro 0.5px solid' : 'none'};
    font-weight: 700;
    margin-right: 1em;
    margin-left: 1em;
    font-size: 1em;
  `

  // const [isFollowed, setIsFollowed] = useState<boolean>(props.isFollowed);
  return (
    <button className={followButton} onClick={props.onClick}>
      {isFollowed ? '팔로우 중' : '팔로우'}
    </button>
  )
}

export default FollowButton;