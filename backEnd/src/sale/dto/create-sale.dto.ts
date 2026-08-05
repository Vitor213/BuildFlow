import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateSaleDto {
  @IsInt()
  @Min(1)
  customerId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
