import http from 'http';
import SocketService from './services/socket';

async function main() {
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
  });

  socketService.listeners();
}

main();
