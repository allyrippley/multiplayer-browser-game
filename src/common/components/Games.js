import React, { Component, PropTypes } from 'react'
import GameListItem from './GameListItem'
import GameListModalItem from './GameListModalItem'
import { Modal, Glyphicon, Input, Button } from 'react-bootstrap'
import * as actions from '../actions/actions'
import uuid from 'node-uuid'

export default class Games extends Component {

  static propTypes = {
    games: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      addGameModal: false,
      gameName: '',
      moreGamesModal: false
    }
  }
  handleChangeGame(game) {
    if(this.state.moreGamesModal) {
      this.closeMoreGamesModal()
    }
    this.props.onClick(game)
  }
  openAddGameModal(event) {
    event.preventDefault()
    this.setState({addGameModal: true})
  }
  closeAddGameModal(event) {
    event.preventDefault()
    this.setState({addGameModal: false})
  }
  handleModalChange(event) {
    this.setState({gameName: event.target.value})
  }
  handleModalSubmit(event) {
    const { games, dispatch, socket } = this.props
    event.preventDefault()
    if (this.state.gameName.length < 1) {
      this.refs.gameName.getInputDOMNode().focus()
    }
    if (this.state.gameName.length > 0 && games.filter(game => {
      return game.name === this.state.gameName.trim()
    }).length < 1) {
      const newGame = {
        name: this.state.gameName.trim(),
        id: `${Date.now()}${uuid.v4()}`,
        private: false
      }
      dispatch(actions.createGame(newGame))
      this.handleChangeGame(newGame)
      socket.emit('new game', newGame)
      this.setState({gameName: ''})
      this.closeAddGameModal()
    }
  }
  validateGameName() {
    const { games } = this.props
    if (games.filter(game => {
      return game.name === this.state.gameName.trim()
    }).length > 0) {
      return 'error'
    }
    return 'success'
  }
  openMoreGamesModal(event) {
    event.preventDefault()
    this.setState({moreGamesModal: true})
  }
  closeMoreGamesModal(event) {
    event.preventDefault()
    this.setState({moreGamesModal: false})
  }
  createGameWithinModal() {
    this.closeMoreGamesModal()
    this.openAddGameModal()
  }
  render() {
    const { games, messages } = this.props
    const filteredGames = games.slice(0, 8)
    const moreGamesBoolean = games.length > 8
    const restOfTheGames = games.slice(8)
    const newGameModal = (
      <div>
        <Modal key={1} show={this.state.addGameModal} onHide={::this.closeAddGameModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Game</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={::this.handleModalSubmit} >
            <Input
              ref="gameName"
              type="text"
              help={this.validateGameName() === 'error' && 'A game with that name already exists!'}
              bsStyle={this.validateGameName()}
              hasFeedback
              name="gameName"
              autoFocus="true"
              placeholder="Enter the game name"
              value={this.state.gameName}
              onChange={::this.handleModalChange}
            />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={::this.closeAddGameModal}>Cancel</Button>
            <Button disabled={this.validateGameName() === 'error' && 'true'} onClick={::this.handleModalSubmit} type="submit">
              Create Game
            </Button>
          </Modal.Footer>
          </Modal>
      </div>
    )
    const moreGamesModal = (
      <div style={{background: 'grey'}}>
        <Modal key={2} show={this.state.moreGamesModal} onHide={::this.closeMoreGamesModal}>
          <Modal.Header closeButton >
            <Modal.Title>More Games</Modal.Title>
            <a onClick={::this.createGameWithinModal} style={{'cursor': 'pointer', 'color': '#85BBE9'}}>
              Create a game
            </a>
          </Modal.Header>
          <Modal.Body>
            <ul style={{height: 'auto', margin: '0', overflowY: 'auto', padding: '0'}}>
              {restOfTheGames.map(game =>
                <GameListModalItem game={game} key={game.id} onClick={::this.handleChangeGame} />
                )}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={::this.closeMoreGamesModal}>Cancel</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
    return (
      <section>
        <div>
          <span style={{paddingLeft: '0.8em', fontSize: '1.5em'}}>
            Games
            <button onClick={::this.openAddGameModal} style={{fontSize: '0.8em', 'background': 'Transparent', marginLeft: '2.8em', 'backgroundRepeat': 'noRepeat', 'border': 'none', 'cursor': 'pointer', 'overflow': 'hidden', 'outline': 'none'}}>
              <Glyphicon glyph="plus" />
            </button>
          </span>
        </div>
          {newGameModal}
        <div>
          <ul style={{display: 'flex', flexDirection: 'column', listStyle: 'none', margin: '0', overflowY: 'auto', padding: '0'}}>
            {filteredGames.map(game =>
              <GameListItem  style={{paddingLeft: '0.8em', background: '#2E6DA4', height: '0.7em'}} messageCount={messages.filter(msg => {
                return msg.gameID === game.name
              }).length} game={game} key={game.id} onClick={::this.handleChangeGame} />
              )}
          </ul>
          {moreGamesBoolean && <a onClick={this.openMoreGamesModal} style={{'cursor': 'pointer', 'color': '#85BBE9'}}> + {games.length - 8} more...</a>}
          {moreGamesModal}
        </div>
      </section>
    )
  }
}
