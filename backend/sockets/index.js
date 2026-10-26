module.exports = function initSockets(io) {
  io.on("connection", (socket) => {
    socket.emit("status", { online: true });
  });
};
