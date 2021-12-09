import { css } from '@emotion/css';
import styled from '@emotion/styled';
import axios from 'axios';
import React, { useLayoutEffect } from 'react'
import { useState } from 'react';
const backServer = process.env.REACT_APP_backServer;
import { IUser } from '../../types/postTypes';
import MinstagramModal from '../Modal/MinstagramModal';
import Profile from '../Profile';


const ProfileDiv = styled.div`
  margin-bottom: 1em;

  &:last-child {
    margin-bottom: 0;
  }
`

const FollowListModal = (props: { open: boolean, onClose: () => void, ids: string[], title?: string, width?: string }) => {
  const [users, setUsers] = useState<IUser[]>([]);

  // id 를 기반으로 유저 정보(IUser) 가져오기
  useLayoutEffect(() => {
    const f = async () => {
      const us: IUser[] = []
      for (const id of props.ids) {
        const res = await axios.get<IUser>(`${backServer}/users/${id}`, { withCredentials: true })
        us.push(res.data)
      }
      setUsers(us);
    }
    f();
  }, [props.ids])

  return (
    <MinstagramModal
      {...props}
    >
      <div className={css`padding: 1em; overflow-y: scroll; max-height: 20em;`}>
        {users.length > 0 &&
          users.map((user, i) => <ProfileDiv key={i} onClick={props.onClose}>
            <Profile user={user} imageStyle={css`width: 2em; height: 2em;`} />
          </ProfileDiv>)}
        {users.length === 0 &&
          <p>아직 아무도 없어요.</p>}
      </div>
    </MinstagramModal >
  )
}

export default FollowListModal;