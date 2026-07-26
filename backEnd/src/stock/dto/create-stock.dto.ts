import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StockType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

export class CreateStockDto {

  @IsInt()
  productId!: number;

  @IsInt()
  quantity!: number;

  @IsEnum(StockType)
  type!: StockType;

  @IsOptional()
  @IsString()
  reason?: string;
}