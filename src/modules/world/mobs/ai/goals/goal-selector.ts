import { Goal, GoalType } from "./goal";

class GoalSelector {
  public disabledGoalTypes: Set<GoalType> = new Set();

  private availableGoals: Set<Goal> = new Set();

  private activeGoals: Map<GoalType, Goal> = new Map();

  public addGoal(priority: number, goal: Goal): void {
    goal.priority = priority;
    this.availableGoals.add(goal);
  }

  // TODO: add removeGoal method
  public removeGoal(_goal: Goal): void {}

  public onTick(): void {
    for (const goal of this.availableGoals) {
      if (this.goalDisabled(goal)) continue;
      if (!goal.isRunning) {
        this.replaceGoals(goal);
        continue;
      }
      if (goal.canStillUse) continue;
      goal.stop();
    }
    this.tickGoals(true);
  }

  public tickGoals(force: boolean) {
    for (const goal of this.availableGoals) {
      if (!goal.isRunning) continue;

      if (!force && !goal.updateEveryTick) continue;
      goal.onTick?.();
    }
    this.activeGoals = new Map(
      Array.from(this.activeGoals.entries()).filter(
        ([_, goal]) => !goal.isRunning
      )
    );
  }

  private replaceGoals(goal: Goal) {
    if (!goal.canUse) return;
    const goalTypes = Array.from(goal.types);
    const activeGoals = goalTypes.map((goalType) =>
      this.activeGoals.get(goalType)
    );

    /* if (
      !activeGoals.every(
        (active) => active === undefined || active.priority < goal.priority
      )
    )
      return; */

    for (const activeGoal of activeGoals) {
      if (!activeGoal) continue;
      if (activeGoal.priority >= goal.priority) return;
    }

    console.warn("Replacing goals");
    for (const type of goalTypes) {
      const goalPerType = this.activeGoals.get(type);

      if (goalPerType) goalPerType.stop();
      this.activeGoals.set(type, goal);
    }

    goal.start();
  }

  private goalDisabled(goal: Goal): boolean {
    for (const type of goal.types) {
      if (this.disabledGoalTypes.has(type)) return true;
    }
    return false;
  }
}

export { GoalSelector };
