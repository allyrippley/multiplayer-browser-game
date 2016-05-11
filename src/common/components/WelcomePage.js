import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { welcomePage } from '../actions/actions'
import { connect } from 'react-redux'
import { Input, Button } from 'react-bootstrap'
import SignIn from './SignIn'

class WelcomePage extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      username: ''
    }
  }
  componentDidMount() {
    this.refs.usernameInput.getInputDOMNode().focus()
  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value })
    }
  }
  handleSubmit() {
    const { dispatch } = this.props
    const username = this.state.username
    dispatch(welcomePage(username))
    this.setState({ username: '' })
  }
  render() {
    const {screenWidth} = this.props
    return (
      <div>
        <header style={{display: 'flex', justifyContent: 'center', flexGrow: '0', order: '0'}}>
          <div style={{justifyContent: 'center'}}>
            <p style={{fontSize: '1.5em', marginRight: '1em'}}>Online multiplayer game</p>
            <p>Still under construction.</p>
          </div>
        </header>
        <main style={{display: 'flex', justifyContent: 'center'}}>

          <form style={{height: '20rem', display: 'flex', justifyContent: 'center'}}>
            <div style={{margin: 'auto', paddingRight: '0.2em', height: '3.5em'}}>
              <Input
                style={{height: '2.7em', fontSize: '1.3em'}}
                ref="usernameInput"
                type="text"
                name="username"
                value={this.state.username}
                placeholder="Enter username"
                onChange={this.handleChange}
              />
            </div>
            <section style={{margin: 'auto', width: '12em', height: '3.5em'}}>
              <Link to="/signup">
                <Button
                  bsStyle="success"
                  style={{margin: 'auto', width: '12em', height: '3.5em'}}
                  type="submit"
                  onClick={this.handleSubmit}>
                    <p style={{margin: '0', padding: '0', fontSize: '1.5em'}}>Sign Up</p>
                </Button>
              </Link>
            </section>
          </form>
          <div style={{height: '3.5em', width: '12em', alignSelf: 'center', display: 'flex', marginLeft: '1em'}}>
            <p style={{marginRight: '1em', marginTop: '1em'}}> Or </p>
            <Link to="/signin">
              <Button style={{margin: 'auto', height: '3.5em'}} bsStyle="default" >Sign in</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
      screenWidth: state.environment.screenWidth
  }
}

WelcomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  screenWidth: PropTypes.any
}

export default connect(mapStateToProps)(WelcomePage)
