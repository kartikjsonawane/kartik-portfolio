import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Message from '../models/Message.js'

export const initSocket = (io) => {
  // Auth middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1]

      if (!token) return next(new Error('Not authenticated'))
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) return next(new Error('User not found'))
      socket.user = user
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    const user = socket.user

    // Join a room
    socket.on('join_room', (room = 'general') => {
      socket.join(room)
      socket.currentRoom = room
      socket.to(room).emit('user_joined', { userId: user._id, name: user.name })
    })

    // Leave room
    socket.on('leave_room', (room) => {
      socket.leave(room)
      socket.to(room).emit('user_left', { userId: user._id, name: user.name })
    })

    // Send message
    socket.on('send_message', async ({ room = 'general', content }) => {
      try {
        if (!content?.trim()) return
        const msg = await Message.create({ content: content.trim(), author: user._id, room })
        await msg.populate('author', 'name avatar')
        io.to(room).emit('new_message', msg)
      } catch (err) {
        socket.emit('error', { message: err.message })
      }
    })

    // Typing indicators
    socket.on('typing_start', ({ room }) => {
      socket.to(room).emit('typing', { userId: user._id, name: user.name })
    })
    socket.on('typing_stop', ({ room }) => {
      socket.to(room).emit('stopped_typing', { userId: user._id })
    })

    socket.on('disconnect', () => {
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('user_left', { userId: user._id, name: user.name })
      }
    })
  })
}
