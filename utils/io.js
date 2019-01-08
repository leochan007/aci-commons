const socketIO = require('socket.io');

console.log(socketIO);

let io = null

const connect = (server) => {
  io = socketIO(server)
}

const getSocket = () => io

module.exports = {
  connect,
  getSocket
}
