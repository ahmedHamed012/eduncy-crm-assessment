import { Module } from '@nestjs/common';
import { ContactService } from './services/contact.service';
import { ContactController } from './controller/contact.controller';
import { ConfigModule } from '@nestjs/config';
import { SqlService } from 'src/core/services/sql.service';

@Module({
  imports: [ConfigModule],
  controllers: [ContactController],
  providers: [ContactService, SqlService],
  exports: [ContactService],
})
export class ContactModule {}
