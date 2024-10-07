import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Ger user with specific id',
    example: 1212,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
