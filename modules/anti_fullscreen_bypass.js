import { Network } from "kumiyui"

let is_toggled = false;
Network.register_network_hook("before", (context) => {
  if (!is_toggled) return;

  const url = context.args[0];
  const body = context.args[1];

  if (
    url
      ?.toString()
      .toLowerCase()
      .replaceAll(" ", "")
      .includes("frontexamtrack/saveobj")
  ) {
    if (body.includes("exit_full_screen") || body.includes("blur_window"))
      return { status: 404 };
  }
})

export const anti_fullscreen_bypass = () => {
  const main = (args, toggle) =>
    is_toggled = toggle;

  return {
    command: "anti_fullscreen_bypass",
    aliases: ["afb", "fullscreen-bypass"],
    description: "disable azota's forced fullscreen and if you press f11 or escape from fullscreen mode, teacher won't notice that you are cheating",
    is_toggle: true,
    callback_fn: main
  }
}