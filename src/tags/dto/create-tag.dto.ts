import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsUrl,
  IsJSON,
  Matches,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Name of the tag',
    example: 'nestjs',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Name can be at most 256 characters long.' })
  name: string;

  @ApiProperty({
    description: 'Slug for the tag (unique identifier for URLs)',
    example: 'nestjs',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
  })
  @MaxLength(256, { message: 'Slug can be at most 256 characters long.' })
  slug: string;

  @ApiPropertyOptional({
    description: 'Optional description of the tag',
    example:
      'A framework for building efficient, scalable Node.js server-side applications.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Optional schema for the tag as a JSON string',
    example: '{"type":"tag","category":"framework"}',
  })
  @IsOptional()
  @IsString()
  @IsJSON({ message: 'Schema must be a valid JSON string.' })
  schema?: string;

  @ApiPropertyOptional({
    description: 'Optional featured image URL for the tag',
    example: 'https://example.com/nestjs-featured-image.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Featured image URL must be a valid URL.' })
  @MaxLength(1024, { message: 'URL can be at most 1024 characters long.' })
  featuredImageUrl?: string;
}
