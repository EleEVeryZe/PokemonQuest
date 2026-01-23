export class Pokemon {
  constructor(
    public readonly id: number,
    public name: string,
    public type: string, //TODO: convert this to array
    public createdAt: Date
  ) {}
}