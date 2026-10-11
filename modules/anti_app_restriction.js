import { create_encryption } from "./encryption";
import { Network, store, Logger } from "kumiyui";

// js run on single thread so no need to atomic locking
let is_toggled = false;
let main_logger = null;
let _encode = null;
let _decode = null;

// potential request route
// usually it's is "https://azt-testbank-api.azota.vn/api/FrontExam/InitData?hashId=&hasInfo=0&device=&practice=0&isWebDevice=1"
const potential_route = "frontexam/initdata"

// register network at start to avoid race condition
Network.register_network_hook("after", async (context, response) => {
  // only run on toggle
  if (!is_toggled) return;

  const url = context.args[0];
  if (url?.toString()?.toLowerCase().replaceAll(" ", "").includes(potential_route)) {
    // spoofing response
    try {
      if (!_encode || !_decode) {
        const { encode, decode } = await create_encryption();
        _encode = encode;
        _decode = decode;
      }

      // decode the data
      const is_json_res = Network.is_json(response);
      const server_resdata = is_json_res ? await response?.json() : response;
      const decoded_data = _decode(server_resdata?.data?.content);

      // change the allow app only to 0 to set it to false
      decoded_data["examConfigObj"]["allowAppOnly"] = 0;

      // encode it back and set the value
      const encoded_data = _encode(decoded_data);
      server_resdata["data"]["content"] = encoded_data;

      return {
        body: is_json_res ? JSON.stringify(server_resdata) : server_resdata
      }
    } catch (err) {
      main_logger?.error("something went wrong with the anti_app_restriction script, please read the error and fix the code or report it onto the github issues", err);
      return null;
    }
  }
})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const anti_app_restriction = ({ logger }) => {
  const main = (args, toggle) => {
    is_toggled = toggle;

    // this only work before the web request for information
    if (
      toggle === true &&
      store.get("aar_on_reload", false) !== true
    ) {
      is_toggled = false; // avoid network hook from loading
      alert("please reload to load anti_app_restriction");
      store.set("aar_on_reload", true);
      return window.location.reload();
    }
    
    // remove the warning if the user turned the feature off
    if (toggle === false)
      store.set("aar_on_reload", false);
  }

  // logger
  main_logger = logger;

  return {
    command: "anti_app_restriction",
    aliases: ["aar"],
    description: "bypass azota's app restriction and allow you to take a test on web without requiring the azota student app.",
    is_toggle: true,
    callback_fn: main
  }
}