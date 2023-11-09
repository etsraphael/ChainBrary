export class BidCreation {
  constructor(
    public communityAddress: string,
    public extendTimeInMinutes: number,
    public durationInMinutes: number,
    public imgLists: string[],
    public bidName: string
  ) {}
}
