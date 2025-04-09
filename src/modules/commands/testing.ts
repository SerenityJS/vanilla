import { CommandPalette, Player, StringEnum } from "@serenityjs/core";

import { IVanillaCommand } from "../../types";

class TestingCommand implements IVanillaCommand {
  public load(registry: CommandPalette): void {
    registry.register(
      "gametest",
      "Vanilla testing command",
      (registry) => {
        registry.overload(
          {
            test: StringEnum
          },
          ({ origin, test }) => {
            if (!(origin instanceof Player)) return;
            return {
              message: `Testing command called with argument ${test}`
            };
          }
        );
      },
      () => {}
    );
  }
}

export default new TestingCommand();
