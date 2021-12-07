import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { backServer } from '../../configs/env';
import { Popover } from '@mui/material';
import { IUser } from '../../types/postTypes';
import styled from '@emotion/styled';
import Profile from '../Profile';
import { css } from "@emotion/css";

const ProfileDiv = styled.div`
  margin-bottom: 1em;

  &:last-child {
    margin-bottom: 0;
  }
`

const searchInputStyle = css`
  width: 17em;
  height: 1.7em;
  border-radius: 5px;
  border: 0.5px solid gainsboro;
  padding-left: 0.6em;
`

const SearchText = () => {
  const [text, setText] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [anchor, setAnchor] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const f = async () => {
      if (text.length > 0) {
        const res = await searchAPI(text);
        setUsers(res.data);
      } else {
        setUsers([])
        onClose()
      }
    }
    f();
  }, [text])

  const searchAPI = (text: string) => {
    return axios.get<IUser[]>(`${backServer}/users/search`, {
      params: {
        text: text
      },
      withCredentials: true
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (e.target.value.length === 0) {
      setUsers([])
      onClose();
    } else {
      if (!anchor) setAnchor(e.target)
    }
  }

  const onClose = () => {
    setAnchor(null);
  }

  const open = !!anchor
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchor}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableAutoFocus={true}
        disableEnforceFocus={true}
      >
        <div className={css`padding: 1em; width: 15em; max-height: 20em; overflow-y: scroll;`}>
          {users.length > 0 && users.map((user, i) => <ProfileDiv key={i}>
            <Profile user={user} imageStyle={css`width: 2em; height: 2em;`} onClick={() => setAnchor(null)} />
          </ProfileDiv>)}
          {users.length === 0 && <p>검색 결과가 없습니다.</p>}
        </div>
      </Popover>
      <input type="text" value={text} className={searchInputStyle} onChange={onChange} placeholder="검색" />
    </>
  )
}

export default SearchText;