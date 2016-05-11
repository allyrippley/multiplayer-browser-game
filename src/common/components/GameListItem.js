import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Button } from 'react-bootstrap'

const GameListItem = (props) => {
  const { game: selectedGame, onClick, game } = props
  return (
    <Button bsSize="xsmall" bsStyle="primary" >
      <a className={classnames({ selected: game === selectedGame })}
         style={{cursor: 'hand', color: 'white'}}
         onClick={() => onClick(game)}>
        <li style={{textAlign: 'left', cursor: 'pointer', marginLeft: '2em'}}>
          <h5>{game.name}</h5>
        </li>
      </a>
    </Button>
  )
}

GameListItem.propTypes = {
  game: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default GameListItem
