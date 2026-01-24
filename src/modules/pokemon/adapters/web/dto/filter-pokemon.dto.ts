export class FilterPokemonDto {
  constructor(
    public name?: string,
    public types?: string[]
  ) {}
}