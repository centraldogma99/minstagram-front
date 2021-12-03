import React, { useState } from 'react'
import { css } from '@emotion/css'
import { IComment } from "../../types/postTypes";
import { Link } from 'react-router-dom';
import CommentMenuModal from '../Modal/CommentMenuModal';
import optionImg from '../../assets/option.svg'
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('ko')

const commentTimestamp = css`
  font-size: 0.8em;
  margin-top: 0.5em;
  margin-bottom: 1em;
`

const Comment = (props: { comment: IComment, index: number, style?: string, timestamp?: boolean }) => {
  const { comment, index, style } = props
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const commentContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 0.2em;
  `

  const CommentContent = css`
    ${style}
  `;

  const CommentAuthorName = css`
    display: inline-block;
    font-weight: bold;
    margin-right: 1em;
    ${style}
  `;

  return (
    <div className={commentContainer} key={index}>
      <CommentMenuModal
        open={open}
        onClose={() => setOpen(false)}
        index={comment._id}
        width="18em"
        isAuthor={comment.author._id === user._id}
      />
      <div className={css`display: flex; flex-direction: row; justify-content: space-between`}>
        <div>
          <Link to={`/${comment.author.name}`}>
            <span className={CommentAuthorName}>{comment.author.name}</span>
          </Link>
          <span className={CommentContent}>{comment.content}</span>
        </div>
        <img src={optionImg} className={css`width: 1em; height: 1em; cursor: pointer;`} onClick={() => { setOpen(true) }} />
      </div>
      {props.timestamp && <div className={commentTimestamp}>
        {dayjs(new Date(comment.timestamp)).fromNow()}
      </div>}
    </div>
  )
}

export default Comment;