import { IsNotEmpty } from 'class-validator';

export class CreateTypePokemonDto {
  @IsNotEmpty({ message: "Your Pokemon must have a type" })
  name: string;
}