import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
  IsDate,
  IsUrl,
  ArrayMinSize,
  ArrayMaxSize,
  MinLength,
  MaxLength,
  Matches,
  IsJSON,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMetaOptionDto } from 'src/meta-options/dto/create-meta-option.dto';

export enum PostType {
  POST = 'post',
  PAGE = 'page',
  STORY = 'story',
  SERIES = 'series',
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  REVIEW = 'review',
  PUBLISHED = 'published',
}

export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post', example: 'My First Post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long.' })
  @MaxLength(512, { message: 'Title can be at most 512 characters long.' })
  title: string;

  @ApiProperty({
    description: 'Slug for the post URL',
    example: 'my-first-post',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
  })
  @MinLength(3, { message: 'Slug must be at least 3 characters long.' })
  @MaxLength(512, { message: 'Slug can be at most 512 characters long.' })
  slug: string;

  @ApiProperty({
    enum: PostType,
    description:
      'Type of the post. Possible values: post, page, story, series.',
    example: PostType.POST,
  })
  @IsEnum(PostType, {
    message: 'postType must be one of the following: post, page, story, series',
  })
  postType: PostType;

  @ApiProperty({
    enum: PostStatus,
    description:
      'Status of the post. Possible values: draft, scheduled, review, published.',
    example: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus, {
    message:
      'status must be one of the following: draft, scheduled, review, published',
  })
  status: PostStatus;

  @ApiPropertyOptional({
    description: 'Content of the post',
    example: 'This is the content of my first post.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Content must be at least 10 characters long.' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Schema for the post content as a JSON string (optional)',
    example: '{"type":"article","author":"Ezaz Ahmed"}',
  })
  @IsOptional()
  @IsString()
  @IsJSON({ message: 'Schema must be a valid JSON string.' })
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image URL for the post',
    example: 'https://example.com/featured-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Publish date of the post',
    example: '2024-10-06T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedOn?: Date;

  @ApiProperty({
    description: 'Tags associated with the post',
    type: [String],
    example: ['nestjs', 'typescript'],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'There should be at least 1 tag.' })
  @ArrayMaxSize(10, { message: 'You can add a maximum of 10 tags.' })
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Meta options for SEO or other purposes',
    type: CreateMetaOptionDto,
  })
  @IsOptional()
  @Type(() => CreateMetaOptionDto)
  metaOptions?: CreateMetaOptionDto | null;
}
