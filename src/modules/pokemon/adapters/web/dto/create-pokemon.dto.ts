import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateTypePokemonDto } from './create-type-pokemon.dto';
import { Type } from 'class-transformer';

export class CreatePokemonDto {
  @IsNotEmpty({ message: "Your Pokemon must have a name" })
  name: string;
  
  @IsArray({ message: "Types must be an array" })
  @ArrayMinSize(1, { message: "Your Pokemon must have at least one type" })
  @ValidateNested({ each: true }) 
  @Type(() => CreateTypePokemonDto)
  types: CreateTypePokemonDto[];
}