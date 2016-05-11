require('babel-core/register') //enables ES6 ('import'.. etc) in Node

import express from 'express'
import path from 'path'

import mongoose from 'mongoose'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import React from 'react'
import configureStore from '../common/store/configureStore'
import { RouterContext, match } from 'react-router'
import routes from '../common/routes'
import {createLocation} from 'history'
import DevTools from '../common/containers/DevTools'
import cors from 'cors'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config'
const compiler = webpack(webpackConfig)
import User from './models/User.js'
import passport from 'passport'

import SocketIo from 'socket.io'
const app = express()
//set env vars
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev'
process.env.PORT = process.env.PORT || 3000

// connect our DB
mongoose.connect(process.env.MONGOLAB_URI)

process.on('uncaughtException', function (err) {
  console.log(err)
})
app.use(cors())
app.use(passport.initialize())

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}))
app.use(require('webpack-hot-middleware')(compiler))

//load routers
const messageRouter = express.Router()
const usersRouter = express.Router()
const channelRouter = express.Router()
require('./routes/message_routes')(messageRouter)
require('./routes/channel_routes')(channelRouter)
require('./routes/user_routes')(usersRouter, passport)
app.use('/api', messageRouter)
app.use('/api', usersRouter)
app.use('/api', channelRouter)

app.use('/', express.static(path.join(__dirname, '..', 'static')))

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
        <link rel="icon" href="./favicon.ico" type="image/x-icon" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>Mobile Game</title>
      </head>
      <body>
        <container id="react">${html}</container>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}

app.get('/*', function(req, res) {
  const location = createLocation(req.url)
  match({ routes, location }, (err, redirectLocation, renderProps) => {

    const initialState = {
      auth: {
        user: {
          username: 'tester123',
          id: 0,
          socketID: null
        }
      }
    }
    const store = configureStore(initialState)

    if(err) {
      console.error(err)
      return res.status(500).end('Internal server error')
    }

    if(!renderProps) {
      return res.status(404).end('Not found')
    }
    const InitialView = (
      <Provider className="root" store={store}>
        <div style={{height: '100%'}}>
          <RouterContext {...renderProps} />
          {process.env.NODE_ENV !== 'production' && <DevTools />}
        </div>
      </Provider>
    )

    const finalState = store.getState()
    const html = renderToString(InitialView)
    res.status(200).end(renderFullPage(html, finalState))
  })
})

const server = app.listen(process.env.PORT, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('server listening on port: %s', process.env.PORT)
})

const chatIo = new SocketIo(server, {path: '/api/chat'})

const socketEvents = function(chatIo) {
  io.on('connection', function(socket) {
    socket.join('Lobby')
    socket.on('chat mounted', function(user) {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.id)
    })
    socket.on('leave channel', function(channel) {
      socket.leave(channel)
    })
    socket.on('join channel', function(channel) {
      socket.join(channel.name)
    })
    socket.on('new message', function(msg) {
      socket.broadcast.to(msg.channelID).emit('new bc message', msg)
    })
    socket.on('new channel', function(channel) {
      socket.broadcast.emit('new channel', channel)
    })
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user)
    })
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user)
    })
    socket.on('new private channel', function(socketID, channel) {
      socket.broadcast.to(socketID).emit('receive private channel', channel)
    })
  })
}
