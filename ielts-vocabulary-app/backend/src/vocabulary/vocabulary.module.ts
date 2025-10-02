import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularySeederService } from './vocabulary-seeder.service';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularySeederService],
  exports: [VocabularyService, VocabularySeederService],
})
export class VocabularyModule {}