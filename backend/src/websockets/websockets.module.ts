import { Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
  imports: [StatusModule],
  providers: [WebsocketsGateway],
})
export class WebsocketsModule {}
