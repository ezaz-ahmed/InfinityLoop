import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostMetaOptions {
  @ApiProperty({ description: 'Meta option key' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Key must be at least 2 characters long.' })
  @MaxLength(50, { message: 'Key can be at most 50 characters long.' })
  key: string;

  @ApiProperty({ description: 'Meta option value' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Value must be at least 2 characters long.' })
  @MaxLength(100, { message: 'Value can be at most 100 characters long.' })
  value: string;
}
