import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateContactDto } from '../types/dto/contact.dto';
import { IContact } from '../../../../shared/interfaces/contact.interface';
import * as knex from '../../../../database/db-singleton-connection';
import { v4 as uuidv4 } from 'uuid';
import { SqlService } from '../../../../core/services/sql.service';
import { ITransfer } from '../../../../shared/interfaces/transfer.interface';

@Injectable()
export class ContactService {
  constructor(private readonly sqlService: SqlService) {}

  public async create(newContact: CreateContactDto): Promise<void> {
    const { email, company } = newContact;
    const duplicatedContact = await this.sqlService.checkExistenceRecord(
      'contacts',
      {
        email,
        company,
      },
    );
    if (duplicatedContact) {
      throw new BadRequestException(
        `Contact with email ${email} and company ${company} already exists!`,
      );
    }
    try {
      newContact.id = uuidv4();
      await this.sqlService.insert('contacts', newContact);
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException('Failed to create contact.');
    }
  }
  //----------------------------------------------------------------------------------------
  public async findAllWithFiltering(
    company?: string,
    isDeleted?: boolean,
    created_at?: Date,
  ): Promise<IContact[]> {
    try {
      const query = knex
        .default('contacts')
        .select('*')
        .where('is_deleted', false);

      if (company) {
        query.where('company', company);
      }

      if (isDeleted !== undefined) {
        query.andWhere('is_deleted', isDeleted);
      }

      if (created_at) {
        query.andWhereRaw('DATE(created_at) = ?', [
          new Date(created_at).toISOString().split('T')[0],
        ]);
      }

      return query;
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else
        throw new InternalServerErrorException(
          'Failed to fetch contacts data.',
        );
    }
  }
  //----------------------------------------------------------------------------------------
  public async findWithId(id: string): Promise<IContact> {
    try {
      const contact = await this.sqlService.select('contacts', ['*'], {
        id,
      });
      if (!contact || contact.length == 0)
        throw new BadRequestException('Contact not found');
      return contact[0];
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else
        throw new InternalServerErrorException('Failed to fetch contact data.');
    }
  }
  //----------------------------------------------------------------------------------------
  public async updateWithId(
    id: string,
    contactNewData: IContact,
  ): Promise<void> {
    try {
      const userTempData = await this.findWithId(id);
      const newHistoryEntry = {
        ...userTempData,
        updated_at: new Date().getTime(),
      };
      // const checkEmailExistence = await this.checkDuplicateRecord({
      //   email: contactNewData.email ? contactNewData.email : userTempData.email,
      //   company: contactNewData.company
      //     ? contactNewData.company
      //     : userTempData.company,
      // });

      // if (checkEmailExistence) {
      //   throw new BadRequestException(
      //     `Contact with this email and company already exists!`,
      //   );
      // }
      const { history, ...historyEntryWithoutHistory } = newHistoryEntry;
      await knex
        .default('contacts')
        .where({ id })
        .update({
          ...contactNewData,
          history: knex.default.raw(
            `
            (
              SELECT jsonb_agg(DISTINCT x) 
              FROM jsonb_array_elements(history || ?::jsonb) AS x
              WHERE jsonb_typeof(x) = 'object'
            )
            `,
            [JSON.stringify(historyEntryWithoutHistory)],
          ),
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else
        throw new InternalServerErrorException('Failed to fetch contact data.');
    }
  }
  //----------------------------------------------------------------------------------------
  public async deleteWithId(id: string): Promise<void> {
    try {
      await this.sqlService.deleteSelected('contacts', {
        id,
      });
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else
        throw new InternalServerErrorException(
          'Failed to delete contact data.',
        );
    }
  }
  //----------------------------------------------------------------------------------------
  public async transferBalance(transferData: ITransfer): Promise<void> {
    try {
      const sender = await this.sqlService.select('contacts', ['*'], {
        id: transferData.from_contact_id,
      });

      const receiver = await this.sqlService.select('contacts', ['*'], {
        id: transferData.to_contact_id,
      });

      const duplicateTransfer = await this.sqlService.checkExistenceRecord(
        'transfers',
        {
          from_contact_id: transferData.from_contact_id,
          to_contact_id: transferData.to_contact_id,
        },
      );

      if (!(sender.length > 0) || !(receiver.length > 0)) {
        throw new BadRequestException("The sender or receiver doesn't exist!");
      }

      if (+sender[0].balance < transferData.amount) {
        throw new BadRequestException(
          "The sender doesn't have enough balance to transfer!",
        );
      }

      if (duplicateTransfer) {
        const oldTransferData = await this.sqlService.selectAll(
          'transfers',
          ['*'],
          {
            from_contact_id: transferData.from_contact_id,
            to_contact_id: transferData.to_contact_id,
          },
        );

        await this.sqlService.update(
          'transfers',
          {
            amount: +oldTransferData[0].amount + transferData.amount,
          },
          {
            from_contact_id: transferData.from_contact_id,
            to_contact_id: transferData.to_contact_id,
          },
        );
      }

      await this.updateSenderAndReceiverBalance(
        sender[0].id,
        receiver[0].id,
        transferData.amount,
        sender[0].balance,
        receiver[0].balance,
      );

      await this.sqlService.insert('transfers', transferData);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      else
        throw new InternalServerErrorException(
          'Failed to delete contact data.',
        );
    }
  }
  //----------------------------------------------------------------------------------------
  public async findContactAuditWithId(id: string): Promise<IContact[]> {
    try {
      const contact = await this.sqlService.select('contacts', ['*'], {
        id,
      });

      if (contact.length == 0)
        throw new BadRequestException('Contact not found');

      return contact[0].history;
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else
        throw new InternalServerErrorException(
          'Failed to fetch contact audit data.',
        );
    }
  }
  //----------------------------------------------------------------------------------------
  private async updateSenderAndReceiverBalance(
    senderId: string,
    receiverId: string,
    amount: number,
    senderOldBalance: number,
    receiverOldBalance: number,
  ): Promise<void> {
    await this.sqlService.update(
      'contacts',
      {
        balance: +senderOldBalance - amount,
      },
      { id: senderId },
    );
    await this.sqlService.update(
      'contacts',
      {
        balance: +receiverOldBalance + amount,
      },
      { id: receiverId },
    );
  }
}
