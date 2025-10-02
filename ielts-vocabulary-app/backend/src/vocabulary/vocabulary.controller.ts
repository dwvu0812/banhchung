import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('difficulty') difficulty?: string,
    @Query('topic') topic?: string,
  ) {
    return this.vocabularyService.findAll(
      parseInt(page),
      parseInt(limit),
      difficulty,
      topic,
    );
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.vocabularyService.search(query, parseInt(page), parseInt(limit));
  }

  @Get('topics')
  getTopics() {
    return this.vocabularyService.getTopics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findById(id);
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  initializeSampleData() {
    return this.vocabularyService.initializeSampleData();
  }
}