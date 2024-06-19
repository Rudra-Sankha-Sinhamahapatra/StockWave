import { Server } from "socket.io";
import { Redis } from "ioredis";
import * as dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST;
const redisPort = parseInt(process.env.REDIS_PORT || '6379');
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

// Handle connection errors
const handleRedisError = (redisInstance: Redis) => {
  redisInstance.on('error', (err) => {
    console.error(`[ioredis] Unhandled error event: ${err}`);
  });
};

handleRedisError(pub);
handleRedisError(sub);

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

      // Listen for user registration
      socket.on('event:register', async ({ name }: { name: string }) => {
        console.log(`User Registered: ${name} with Socket ID: ${socket.id}`);
        await pub.hset("users", socket.id, name);
      });

      // Listen for messages
      socket.on('event:message', async ({ message }: { message: string }) => {
        const name = await pub.hget("users", socket.id);
        console.log("New Message Received from", name, ":", message);
        await pub.publish("MESSAGES", JSON.stringify({ name, message }));
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        const name = await pub.hget("users", socket.id);
        console.log(`User Disconnected: ${name} with Socket ID: ${socket.id}`);
        await pub.hdel("users", socket.id);
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
