import { Network, store } from "kumiyui";

let is_toggled = false;

Network.register_network_hook("after", async (context, response) => {
  if (!is_toggled) return;
  const url = context.args[0]
    ?.toString()
    .toLowerCase()
    .replaceAll(" ", "");

  // disable ads
  if (url.includes("FrontExam/MustViewAds")) {
    const _json = await response.json() ?? {};

    // disable the ads
    _json.data = false;

    // return the data
    return {
      body: JSON.stringify(_json)
    }
  }

  // enable vip
  if (url.includes("FrontVip/CheckVipObject")) {
    const _json = await response.json() ?? {};

    // disable the ads
    _json.data = true;

    // return the data
    return {
      body: JSON.stringify(_json)
    }
  }
})

export const vip_bypass = () => {
  const main = (args, toggle) => {
    is_toggled = toggle;

    // this only work before the web request for information
    if (toggle === true && store.get("vip_bypass_on_reload", false) !== true) {
      is_toggled = false; // avoid network hook from loading at this stage
      alert("please reload to load vip_bypass");
      store.set("vip_bypass_on_reload", true);
      return window.location.reload();
    }
  
    // remove the warning if the user turned the feature off
    if (toggle === false)
      store.set("vip_bypass_on_reload", false);
  }

  return {
    command: "vip_bypass",
    aliases: ["vip"],
    description: "disable ads and be able to attend the test without relying on teacher's VIP pack status.",
    is_toggle: true,
    callback_fn: main
  }
}