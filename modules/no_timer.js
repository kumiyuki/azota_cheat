import { Network, store } from "kumiyui";
import { create_encryption } from "./encryption"

// line 43238: this.currentTakeTestStepData.countDownSecond = Infinity; (could lead to Infinity time)
// but that method is not possible since they are wrapped in a function (since you can't access inner scope's variable)... so hook into the API instead
// the line 43238 is in 140.8682c63b1b18e3bf.js

let is_toggled = false;
let _encode = null;
let _decode = null;

Network.register_network_hook("after", async (context, response) => {
  if (!is_toggled) return;
  const url = context.args[0];
  if (
    url
      ?.toString()
      .toLowerCase()
      .replaceAll(" ", "")
      .includes("api/frontexam/initdata")
  ) {
    if (!_encode || !_decode) {
      const { encode, decode } = await create_encryption();
      _encode = encode;
      _decode = decode;
    }
    const _json = await response.json();
    const data = _decode(_json?.data?.content); 
    data.examObj.minutes = Infinity;
    _json.data.content = _encode(data);
    let new_res = JSON.stringify(_json);
    return {
      body: new_res
    }
  }
})

export const no_timer = () => {
  const main = (args, toggle) => {
    is_toggled = toggle;

    // this only work before the web request for information
    if (toggle === true && store.get("no_timer_on_reload", false) !== true) {
      is_toggled = false; // avoid network hook from loading at this stage
      alert("please reload to load no_timer");
      store.set("no_timer_on_reload", true);
      return window.location.reload();
    }
  
    // remove the warning if the user turned the feature off
    if (toggle === false)
      store.set("no_timer_on_reload", false);
  }

  return {
    command: "no_timer",
    aliases: ["inftime", "no_time"],
    description: "makes time infinite so you can submit the answer at anytime. (NOTE: if teacher stops the test or close it, you won't be able to submit the answer, so DON'T USE this in a serious test/exam)",
    is_toggle: true,
    callback_fn: main
  }
}