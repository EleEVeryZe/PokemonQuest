import { TypeEntity } from "./pokemon-type.entity";

export class Pokemon {
  constructor(
    public readonly id: number,
    public name: string,
    public types: TypeEntity[],
    public createdAt: Date
  ) {}
}