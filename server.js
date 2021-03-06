const express = require('express')
const socketioAuth = require("socketio-auth")
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const app = express()
const game = require('./game')
// Start it up!
const port = process.env.PORT || 4000
const logger = () => console.log(`Listening: ${port}`)
const server = app.listen(port)

// serve it up!
app.get('/', (req, res, next) => {
  res.sendFile(require('path').resolve('./client/build/index.html'))
})

// Set static file location for production
app.use(express.static(require('path').resolve('./client/build')))

// Connect to the Database
const mongoose = require("mongoose")
mongoose.Promise = require("bluebird")
const mongoOpts = { useMongoClient: true }
const mongoUrl = "mongodb://heroku_39lqpvm0:k0m7rc2pligndujih4hhlbl4vj@ds139480.mlab.com:39480/heroku_39lqpvm0"
mongoose
  .connect(mongoUrl, mongoOpts)
  .catch(e => console.log(e))

// connect sockets
const io = require("socket.io")(server)

// Authenticate!
const User = require("./User")
const authenticate = async (socket, data, callback) => {
  const { username, password, signup } = data

  try {
    // session
    if (socket.handshake.headers.cookie){
      const cookieUser = cookie.parse(socket.handshake.headers.cookie).user
      if (cookieUser) {
        const username = jwt.decode(cookieUser, 'secret-words')
        if(username){
          const user = await User.findOne({ username })
          if (!user) {
            socket.emit('auth_message', { message: 'No such user'})
            return
          }
          socket.user = user
          return callback(null, !!user)
        }
      }
    }

    // sign up
    if (signup) {
      const user = await User.create({ username, password })
      socket.user = user
      return callback(null, !!user)
    }

    // login
    const user = await User.findOne({ username })
    if (!user) {
      socket.emit('auth_message', { message: 'No such username and password combination'})
      return
    }
    if(user.validPassword(password)) {
      socket.user = user
      return callback(null, user)
    }

    socket.emit('auth_message',  { message: 'No such username and password combination'})
  } catch (error) {
    socket.emit('auth_message', { message: 'Authentication error. Username probably already exists'})
    console.log(error)
    callback(error)
  }

}

// Register Actions
const postAuthenticate = socket => {
  socket.emit('authenticated', jwt.sign(socket.user.username, 'secret-words'))
  game(socket)
}

// Configure Authentication
socketioAuth(io, { authenticate, postAuthenticate, timeout: "none" })
