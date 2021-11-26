import React, { useContext } from "react"
import { IDirectRoom, IDirectMessage } from "../../types/directs";
import AuthContext from "../../context/authContext";
import { css } from "@emotion/css";
import { backServer } from "../../configs/env";
import Profile from "../Profile";

const directMessageContainer = css`
  display: flex;
  flex-direction: row;
`

const directMessages = css`
  max-height: 30em; 
  max-width: 60em;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`

const directMessage = css`
  display: flex;
  align-items: flex-end;
`

const directMessageMe = css`
  /* ${directMessage} */
  /* flex-direction: column;
  align-self: flex-end; */
  margin-right: 0;
  margin-left: auto;
`

const directMessageFriend = css`
  ${directMessage}
  flex-direction: row;
  align-self: flex-start;
`

const directMessageContent = css`
  height: 1em;
  padding: 1em;
  border-radius: 1.2em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
`

const directMessageContentMe = css`
  ${directMessageContent};
  background-color: blue;
  position: relative;
  text-align: right;
`

const directMessageContentFriend = css`
  ${directMessageContent};
  background-color: red;
  position: relative;
  text-align: left;
`

const directMessageAuthorAvatar = css`
  color: green;
`

const DirectMessages = (props: { direct?: IDirectRoom }) => {
  const { direct } = props;
  const { user } = useContext(AuthContext);


  const renderItems = (message: IDirectMessage) => {
    const isMe = message.author._id === user._id;
    return (
      <div className={directMessageContainer}>
        <div className={isMe ? directMessageMe : directMessageFriend}>
          {!isMe &&
            <div className={directMessageAuthorAvatar}>
              <Profile user={message.author} nameHide imageStyle={css`width: 2em; height: 2em;`} />
            </div>
          }
          <div className={isMe ? directMessageContentMe : directMessageContentFriend}>
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={directMessages}>
      {direct ? direct.messages.map(renderItems) : "no content"}
    </div>
  )
}

export default DirectMessages;