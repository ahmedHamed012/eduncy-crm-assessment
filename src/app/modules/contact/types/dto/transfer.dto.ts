import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  from_contact_id: string;

  @IsUUID()
  to_contact_id: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
