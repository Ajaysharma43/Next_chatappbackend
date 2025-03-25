const Socketconnection = (io) => {
// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Emit a welcome message to the connected client
    socket.emit('connection', { message: 'Welcome to the server!' });
  
    // Listen for messages from the client
    socket.on('message', (data) => {
      console.log('Message received:', data);
      // Broadcast the message to all other clients
      io.emit('response', { message: data });
    });
  
    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

export default Socketconnection;