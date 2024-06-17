import { Server } from "socket.io";
import { Redis } from "ioredis";
import * as dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST;
const redisPort = parseInt(process.env.REDIS_PORT || '21580');
const redisUsername = process.env.REDIS_USERNAME || '';
const redisPassword = process.env.REDIS_PASSWORD || '';

const pub = new Redis({
  host: redisHost,
  port: redisPort,
  username: redisUsername,
  password: redisPassword,
});

const sub = new Redis({
  host: redisHost,
  port: redisPort,
  username: redisUsername,
  password: redisPassword,
});

class SocketService {
  private _io: Server;
  
  constructor() {
    console.log("Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      }
    });
    sub.subscribe("MESSAGES");
  }

  public listeners() {
    const io = this._io;
    console.log("Init Socket Listeners");

    io.on('connection', (socket) => {
      console.log(`New Socket Connected`, socket.id);

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log("New Message Received:", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on('message', async (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log("Message from Redis:", message);
        io.emit('event:message', JSON.parse(message));
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
