class Goal {
  public priority: number = 0;
  public isRunning: boolean;
  public types: Set<GoalType> = new Set();

  public constructor() {
    this.isRunning = false;
  }

  public setTypes(types: Array<GoalType>): void {
    this.types = new Set(types);
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.onStart?.();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.onStop?.();
  }

  public onTick?(): void;

  public onStart?(): void;

  public onStop?(): void;

  public get canUse(): boolean {
    return false;
  }

  public get updateEveryTick(): boolean {
    return false;
  }

  public get canStillUse(): boolean {
    return false;
  }
}

enum GoalType {
  Target,
  Move,
  Look,
  Jump
}

export { Goal, GoalType };
