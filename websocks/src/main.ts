import { NestFactory } from '@nestjs/core';
import { Socket } from 'dgram';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: "http://0.0.0.0:3000"
    }
  });
  await io.on('connection', (socket) => {
    console.log("server websock connected");
    socket.on("newUser", (username) => {
      console.log("server side received ", username);
      io.emit("leaderboardUpdate");
    })
    socket.on("newRank", (username) => {
      console.log("server side received ", username);
      io.emit("leaderboardUpdate");
    })
		socket.on("usernameChange", () => {
			console.log("server side received usernameChange");
			io.emit("leaderboardUpdate");
		})
  });
  await server.listen(3003);
}
bootstrap();
