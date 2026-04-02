import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuthService } from '../../../../user-service/src/modules/user-accounts/auth/application/auth.service';
import { DomainException } from '@app/shared/exceptions/domain-exceptions';
import { DomainExceptionCode } from '@app/shared/exceptions/domain-exception-codes';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);

    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        throw new DomainException({
          code: DomainExceptionCode.NotFound,
          message: 'User not found',
        });
      }
      const verifyRT = await this.authService.validateToken(authHeader);
      const userId = verifyRT.userId;

      const roomName = `user:${userId}`;
      await client.join(roomName);

      this.logger.log(`User ${userId} joined room ${roomName}`);
    } catch (e) {
      client.disconnect();
      return;
    }

    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, data: string) {
    this.logger.log(`Message received from client id: ${client.id}`);

    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'Wrong data that will make the test fail',
    };
  }
}
