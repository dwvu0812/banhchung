import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Collocation } from '../interfaces/vocabulary.interface';

export class CreateVocabularyDto {
  @IsString()
  word: string;

  @IsString()
  pronunciation: string;

  @IsString()
  partOfSpeech: string;

  @IsString()
  definition: string;

  @IsString()
  example: string;

  @IsArray()
  @IsOptional()
  synonyms?: string[];

  @IsArray()
  @IsOptional()
  antonyms?: string[];

  @IsArray()
  @IsOptional()
  collocations?: Collocation[];

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @IsArray()
  @IsOptional()
  topics?: string[];
}