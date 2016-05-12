import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { initEnvironment } from '../actions/actions'

class App extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initEnvironment())
  }

  render() {
    const { screenHeight, isMobile, screenWidth } = this.props.environment
    if (isMobile) {
      return (
        <div style={{height: `${screenHeight}px`, width: `${screenWidth}px`}}>
          {this.props.children}
        </div>
      )
    }
    return (
      <div style={{height: '100%'}} >
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    environment: state.environment
  }
}

App.propTypes = {
  dispatch: PropTypes.any,
  environment: PropTypes.any,
  children: PropTypes.any,
}
export default connect(mapStateToProps)(App)
