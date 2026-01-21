export class Pokemon {
  constructor(
    public readonly id: number,
    public name: string,
    public type: string,
    public createdAt: Date
  ) {}
}