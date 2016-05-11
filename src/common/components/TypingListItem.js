import React, { Component, PropTypes } from 'react'

const TypingListItem = (props) => {
  const { username } = props
  return (
    <span>
      {username}
    </span>
  )
}

TypingListItem.propTypes = {
  username: PropTypes.string.isRequired
}

export default TypingListItem
