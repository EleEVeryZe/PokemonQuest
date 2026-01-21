import { IsString, IsNotEmpty } from 'class-validator';

const msgPokemonName = "Your Pokemon must have a name";
const msgPokemonType = "Your Pokemon must have a type";

export class CreatePokemonDto {
  @IsString({ message: msgPokemonName })
  @IsNotEmpty({ message: msgPokemonName })
  name: string;

  @IsString({ message: msgPokemonType })
  @IsNotEmpty({ message: msgPokemonType })
  type: string;
}