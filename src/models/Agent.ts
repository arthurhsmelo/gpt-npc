export interface IAgent {
  readonly id: string;
}
export class Agent implements IAgent {
  constructor(id: string) {
    this.id = id;
  }

  id: string;
}
