import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsArray,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class CreateContactDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string; // Unique per company

  @IsString()
  company: string;

  @IsOptional()
  @IsNumber()
  balance?: number = 0.0; // Default: 0.00

  @IsOptional()
  @IsArray()
  history?: any[];

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean = false; // Default: false

  @IsOptional()
  created_at?: Date = new Date(Date.now());

  @IsOptional()
  updated_at?: Date = new Date(Date.now());
}
