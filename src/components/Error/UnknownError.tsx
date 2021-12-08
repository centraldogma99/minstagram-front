import React from "react"
import { Link } from "react-router-dom"
import { css } from "@emotion/css"

const s = css`
  padding-top: 4em;
`

const UnknownError = () => {
  return (
    <div className={s}>
      <h2>페이지를 로드할 수 없습니다.</h2>
      <h3>알 수 없는 오류가 발생하였습니다. 잠시 후에 다시 시도해 주세요.</h3>
      <Link to="/">
        <p className={css`color: dodgerblue;`}>Minstagram으로 돌아가기.</p>
      </Link>
    </div>
  )
}

export default UnknownError