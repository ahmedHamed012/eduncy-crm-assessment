import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactController } from './modules/contact/controller/contact.controller';
import { ContactModule } from './modules/contact/contact.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ContactModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
