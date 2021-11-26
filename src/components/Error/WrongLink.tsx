import React from "react"
import { Link } from "react-router-dom"
import { css } from "@emotion/css"

const s = css`
  padding-top: 4em;
`

const WrongLink = () => {
  return (
    <div className={s}>
      <h2>죄송합니다. 페이지를 사용할 수 없습니다.</h2>
      <h3>클릭하신 링크가 잘못되었거나 페이지가 삭제되었습니다.</h3>
      <Link to="/">
        <p className={css`color: dodgerblue;`}>Minstagram으로 돌아가기.</p>
      </Link>
    </div>
  )
}

export default WrongLink