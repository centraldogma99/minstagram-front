import React, { useState } from 'react'
import { css } from '@emotion/css'
import { IComment } from "../../types/postTypes";
import { Link } from 'react-router-dom';
import CommentMenuModal from '../Modal/CommentMenuModal';
import optionImg from '../../assets/option.svg'
import { useContext } from 'react';
import AuthContext from '../../context/authContext';

const Comment = (props: { comment: IComment, index: number, style?: string }) => {
  const { comment, index, style } = props
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const commentContainer = css`
    display: flex;
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
      <div>
        <Link to={`/${comment.author.name}`}>
          <span className={CommentAuthorName}>{comment.author.name}</span>
        </Link>
        <span className={CommentContent}>{comment.content}</span>
      </div>
      <img src={optionImg} className={css`width: 1em; height: 1em;`} onClick={() => { setOpen(true) }} />
    </div>
  )
}

export default Comment;