import { IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty({ message: "Your Pokemon must have a name" })
  name: string;

  @IsNotEmpty({ message: "Your Pokemon must have a type" })
  type: string;
}