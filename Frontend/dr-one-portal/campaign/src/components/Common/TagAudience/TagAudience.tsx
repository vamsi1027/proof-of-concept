import React from 'react'
import * as S from './TagAudience.styles'

interface ITagAudienceProps{
  text: string,
  action: ()=> void
}

const TagAudience = ({text, action}: ITagAudienceProps) => {
  return (
    <S.Tag>
      <p>{text}</p>
      <img src="/img/cancel.svg" alt="button cancel"
      onClick={action}
      />
    </S.Tag>
  )
}

export default TagAudience
