import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateMetaOptionDto {
  @ApiProperty({
    description: 'Meta option value as a JSON string',
    example: '{"key": "value"}',
  })
  @IsJSON()
  @IsNotEmpty()
  metaValue: string;
}
