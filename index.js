import { Command, Logger } from "kumiyui";
import { anti_fullscreen_bypass } from "./modules/anti_fullscreen_bypass"
import { no_timer } from "./modules/no_timer"
import { anti_app_restriction } from "./modules/anti_app_restriction"

const logger = new Logger({ name: "azota_cheat", level: Logger.LEVELS.info });

[
  anti_fullscreen_bypass(),
  no_timer(),
  anti_app_restriction(logger.child("anti_app_restriction"))
].forEach((command) => {
  Command(command);
})