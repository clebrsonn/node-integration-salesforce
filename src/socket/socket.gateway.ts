import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
    client.emit('message', 'Welcome to the WebSocket server!');
  }

  async handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }

  sendEventUpdate(eventName: string, message: string): void {
    this.server.emit(eventName, message);
  }
}
