import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { SqlService } from '../../../../core/services/sql.service';
import { BadRequestException } from '@nestjs/common';
import { CreateContactDto } from '../types/dto/contact.dto';

const mockSqlService = {
  insert: jest.fn(),
  update: jest.fn(),
  deleteSelected: jest.fn(),
  select: jest.fn(),
  selectAll: jest.fn(),
  checkExistenceRecord: jest.fn(),
};

const mockContactData: CreateContactDto = {
  first_name: 'Contact_Fname',
  last_name: 'Contact_Lname',
  email: 'test@example.com',
  company: 'Eduncy',
  balance: 100.0,
  history: [],
  is_deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('ContactService', () => {
  let service: ContactService;
  let sqlService: SqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: SqlService, useValue: mockSqlService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    sqlService = module.get<SqlService>(SqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transferBalance', () => {
    it('should throw an error if sender or receiver does not exist', async () => {
      jest
        .spyOn(sqlService, 'select')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await expect(
        service.transferBalance({
          from_contact_id: 'sender-id',
          to_contact_id: 'receiver-id',
          amount: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if sender does not have enough balance', async () => {
      jest
        .spyOn(sqlService, 'select')
        .mockResolvedValueOnce([{ id: 'sender-id', balance: '50' }])
        .mockResolvedValueOnce([{ id: 'receiver-id', balance: '200' }]);

      await expect(
        service.transferBalance({
          from_contact_id: 'sender-id',
          to_contact_id: 'receiver-id',
          amount: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should insert a new transfer if it does not exist before', async () => {
      jest
        .spyOn(sqlService, 'select')
        .mockResolvedValueOnce([{ id: 'sender-id', balance: '500' }])
        .mockResolvedValueOnce([{ id: 'receiver-id', balance: '200' }]);

      jest.spyOn(sqlService, 'checkExistenceRecord').mockResolvedValue(false);
      jest.spyOn(sqlService, 'insert').mockResolvedValue(undefined);

      await service.transferBalance({
        from_contact_id: 'sender-id',
        to_contact_id: 'receiver-id',
        amount: 100,
      });

      expect(sqlService.insert).toHaveBeenCalledTimes(1);
    });
  });

  describe('Email uniqueness', () => {
    it('should return an error if the email already exists', async () => {
      jest.spyOn(sqlService, 'checkExistenceRecord').mockResolvedValue(true);

      await expect(service.create(mockContactData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow creating a new contact if email is unique', async () => {
      jest.spyOn(sqlService, 'checkExistenceRecord').mockResolvedValue(false);
      jest.spyOn(sqlService, 'insert').mockResolvedValue(undefined);

      await service.create(mockContactData);

      expect(sqlService.insert).toHaveBeenCalledWith(
        'contacts',
        mockContactData,
      );
    });
  });

  describe('deleteWithId', () => {
    it('should call sqlService.deleteSelected and soft delete a contact', async () => {
      jest.spyOn(sqlService, 'deleteSelected').mockResolvedValue(undefined);

      await service.deleteWithId('contact-id');

      expect(sqlService.deleteSelected).toHaveBeenCalledWith('contacts', {
        id: 'contact-id',
      });
    });
  });
});
