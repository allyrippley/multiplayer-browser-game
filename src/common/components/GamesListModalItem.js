import React, { PropTypes } from 'react'
import classnames from 'classnames'

const GameListModalItem = (props) => {
  const { game: selectedGame, onClick, game } = props
  return (
    <a className={classnames({ selected: game === selectedGame })}
       style={{ cursor: 'hand', color: 'black'}}
       onClick={() => onClick(game)}>
      <li style={{cursor: 'pointer'}}>
        <h5>{game.name}</h5>
      </li>
    </a>
  )
}

GameListModalItem.propTypes = {
  game: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default GameListModalItem
