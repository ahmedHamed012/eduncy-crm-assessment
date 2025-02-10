import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IContact } from 'src/shared/interfaces/contact.interface';
import { ContactService } from '../services/contact.service';
import { CreateContactDto } from '../types/dto/contact.dto';
import { CreateTransferDto } from '../types/dto/transfer.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
  @Post('/')
  async create(@Body() contact: CreateContactDto): Promise<void> {
    return await this.contactService.create(contact);
  }
  //--------------------------------------------------------------------------------------
  @Post('/transfer')
  async transferBalance(
    @Body() transferData: CreateTransferDto,
  ): Promise<void> {
    return this.contactService.transferBalance(transferData);
  }
  //--------------------------------------------------------------------------------------
  @Get('/')
  async findAllWithFiltering(
    @Query('company') company?: string,
    @Query('isDeleted') isDeleted?: boolean,
    @Query('created_at') created_at?: Date,
  ): Promise<IContact[]> {
    return await this.contactService.findAllWithFiltering(
      company,
      isDeleted,
      created_at,
    );
  }
  //--------------------------------------------------------------------------------------
  @Get('/:id')
  async findWithId(@Param('id') id: string): Promise<IContact> {
    return await this.contactService.findWithId(id);
  }
  //--------------------------------------------------------------------------------------
  @Get('/:id/audit')
  async findContactAuditWithId(@Param('id') id: string): Promise<IContact[]> {
    return await this.contactService.findContactAuditWithId(id);
  }
  //--------------------------------------------------------------------------------------
  @Patch('/:id')
  async updateWithId(
    @Param('id') id: string,
    @Body() newContact: CreateContactDto,
  ): Promise<void> {
    return await this.contactService.updateWithId(id, newContact);
  }
  //--------------------------------------------------------------------------------------
  @Delete('/:id')
  async deleteWithId(@Param('id') id: string): Promise<void> {
    return await this.contactService.deleteWithId(id);
  }
  //--------------------------------------------------------------------------------------
}
