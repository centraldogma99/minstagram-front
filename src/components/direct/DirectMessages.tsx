import React, { useContext } from "react"
import { IDirectRoom, IDirectMessage } from "../../types/directs";
import AuthContext from "../../context/authContext";

const DirectMessages = (props: { direct?: IDirectRoom }) => {
  const { direct } = props;
  const { user } = useContext(AuthContext);

  const renderItems = (message: IDirectMessage) => {
    const isMe = message.author._id === user._id;
    return (
      <div className={isMe ? "direct-message-me" : "direct-message-friend"}>
        {!isMe &&
          <div className="direct-message-author">
            {message.author.name}
          </div>
        }
        <div className="direct-message-content">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="direct-messages">
      {direct ? direct.messages.map(renderItems) : "no content"}
    </div>
  )
}

export default DirectMessages;