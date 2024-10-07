import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all posts by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all posts for the user.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findAll(@Param('id', ParseIntPipe) userId: number) {
    return this.postsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 204,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
