import { Command, Logger } from "kumiyui";
import { anti_fullscreen_bypass } from "./modules/anti_fullscreen_bypass"
import { no_timer } from "./modules/no_timer"
import { anti_app_restriction } from "./modules/anti_app_restriction"
import { vip_bypass } from "./modules/vip_bypass";

const logger = new Logger({ name: "azota_cheat", level: Logger.LEVELS.info });

[
  anti_fullscreen_bypass(),
  no_timer(),
  anti_app_restriction(logger.child("anti_app_restriction")),
  vip_bypass()
].forEach((command) => {
  Command(command);
})