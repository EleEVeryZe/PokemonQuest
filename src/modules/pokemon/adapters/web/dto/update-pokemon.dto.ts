import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

export class UpdatePokemonDto {
  @IsInt({ message: "ID must be an integer" })
  @IsNotEmpty({ message: "We need your pokemon's ID to continue" })
  id: number;

  name: string;
  type: string;
}