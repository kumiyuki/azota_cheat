// ==UserScript==
// @name            azota_cheat
// @version         2.0.0
// @namespace       https://github.com/kumiyuki/azota_cheat/
// @description     cheat for azota
// @author          kumiyuki
// @include         /^https?:\/\/azota\.vn\/.*\/test\/(take-test|take-training)\/.*$/
// @icon            https://www.google.com/s2/favicons?sz=64&domain=azota.vn
// @license         GPL-3.0
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @run-at          document-start
// @downloadURL     https://raw.githubusercontent.com/kumiyuki/azota_cheat/refs/heads/main/dist/azota_cheat.user.js
// @updateURL       https://raw.githubusercontent.com/kumiyuki/azota_cheat/refs/heads/main/dist/azota_cheat.user.js
// @require         https://cdn.jsdelivr.net/gh/kumiyuki/kumiyui@HEAD/cdn_build/dist/kumiyui.min.js
// ==/UserScript==

"use strict";
const require=r=>{if("kumiyui"===r)return window.Kumiyui;throw new Error("Dynamic require of "+moduleName+" is not supported.")};
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // index.js
  var import_kumiyui4 = __require("kumiyui");

  // modules/anti_fullscreen_bypass.js
  var import_kumiyui = __require("kumiyui");
  var is_toggled = false;
  import_kumiyui.Network.register_network_hook("before", (context) => {
    if (!is_toggled)
      return;
    const url = context.args[0];
    const body = context.args[1];
    if (url?.toString().toLowerCase().replaceAll(" ", "").includes("frontexamtrack/saveobj")) {
      if (body.includes("exit_full_screen") || body.includes("blur_window"))
        return { status: 404 };
    }
  });
  var anti_fullscreen_bypass = () => {
    const main = (args, toggle) => is_toggled = toggle;
    return {
      command: "anti_fullscreen_bypass",
      aliases: ["afb", "fullscreen-bypass"],
      description: "disable azota's forced fullscreen and if you press f11 or escape from fullscreen mode, teacher won't notice that you are cheating",
      is_toggle: true,
      callback_fn: main
    };
  };

  // modules/no_timer.js
  var import_kumiyui2 = __require("kumiyui");

  // modules/encryption.js
  var create_encryption = async () => {
    let azt_webpackname = await new Promise((resolve) => {
      const webpack_load_interval = setInterval(() => {
        const webpack_re = Object.keys(unsafeWindow ?? {}).find((el) => el?.toString().toLowerCase().replaceAll(" ", "").includes("webpack"));
        if (typeof webpack_re !== "undefined") {
          clearInterval(webpack_load_interval);
          return resolve(webpack_re);
        }
      }, 250);
    });
    const wpRequire = (unsafeWindow ?? {})?.[azt_webpackname].push([[Symbol()], {}, (r) => r]);
    const gzipHelper = wpRequire(87941).f.prototype;
    const o_resultContentSupport = gzipHelper.resultContentSupport;
    gzipHelper.resultContentSupport = (...args) => o_resultContentSupport.bind({ stringFirst: "<z>:" })(...args);
    const env_gzipHelper = {
      gzipHelper,
      stringFirst: "<z>:",
      sAztCommonReplaceService: {
        castJsonToObj: wpRequire(54450).Z.prototype.castJsonToObj
      }
    };
    const str_hashExtractTemplate = wpRequire(3949).R.prototype.getContentHashConfigSystem.bind(env_gzipHelper)();
    const hashExtractTemplate = wpRequire(3949).R.prototype.castJsonToObj.bind(env_gzipHelper)(str_hashExtractTemplate) ?? [];
    const env_hashExtractTemplate = {
      hashExtractTemplate,
      commonService: {
        castJsonToObj: (...args) => wpRequire(3949).R.prototype.castJsonToObj.bind(env_gzipHelper)(...args)
      }
    };
    return {
      encode: (str) => wpRequire(98230).w.prototype.encode.bind(env_hashExtractTemplate)(str),
      decode: (str) => wpRequire(98230).w.prototype.decode.bind(env_hashExtractTemplate)(str)
    };
  };

  // modules/no_timer.js
  var is_toggled2 = false;
  var _encode = null;
  var _decode = null;
  import_kumiyui2.Network.register_network_hook("after", async (context, response) => {
    if (!is_toggled2)
      return;
    const url = context.args[0];
    if (url?.toString().toLowerCase().replaceAll(" ", "").includes("api/frontexam/initdata")) {
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
      };
    }
  });
  var no_timer = () => {
    const main = (args, toggle) => {
      is_toggled2 = toggle;
      if (toggle === true && import_kumiyui2.store.get("no_timer_on_reload", false) !== true) {
        is_toggled2 = false;
        alert("please reload to load no_timer");
        import_kumiyui2.store.set("no_timer_on_reload", true);
        return window.location.reload();
      }
      if (toggle === false)
        import_kumiyui2.store.set("no_timer_on_reload", false);
    };
    return {
      command: "no_timer",
      aliases: ["inftime", "no_time"],
      description: "makes time infinite so you can submit the answer at anytime. (NOTE: if teacher stops the test or close it, you won't be able to submit the answer, so DON'T USE this in a serious test/exam)",
      is_toggle: true,
      callback_fn: main
    };
  };

  // modules/anti_app_restriction.js
  var import_kumiyui3 = __require("kumiyui");
  var is_toggled3 = false;
  var main_logger = null;
  var _encode2 = null;
  var _decode2 = null;
  var potential_route = "frontexam/initdata";
  import_kumiyui3.Network.register_network_hook("after", async (context, response) => {
    if (!is_toggled3)
      return;
    const url = context.args[0];
    if (url?.toString()?.toLowerCase().replaceAll(" ", "").includes(potential_route)) {
      try {
        if (!_encode2 || !_decode2) {
          const { encode, decode } = await create_encryption();
          _encode2 = encode;
          _decode2 = decode;
        }
        const is_json_res = import_kumiyui3.Network.is_json(response);
        const server_resdata = is_json_res ? await response?.json() : response;
        const decoded_data = _decode2(server_resdata?.data?.content);
        decoded_data["examConfigObj"]["allowAppOnly"] = 0;
        const encoded_data = _encode2(decoded_data);
        server_resdata["data"]["content"] = encoded_data;
        return {
          body: is_json_res ? JSON.stringify(server_resdata) : server_resdata
        };
      } catch (err) {
        main_logger?.error("something went wrong with the anti_app_restriction script, please read the error and fix the code or report it onto the github issues", err);
        return null;
      }
    }
  });
  var anti_app_restriction = ({ logger }) => {
    const main = (args, toggle) => {
      is_toggled3 = toggle;
      if (toggle === true && import_kumiyui3.store.get("aar_on_reload", false) !== true) {
        is_toggled3 = false;
        alert("please reload to load anti_app_restriction");
        import_kumiyui3.store.set("aar_on_reload", true);
        return window.location.reload();
      }
      if (toggle === false)
        import_kumiyui3.store.set("aar_on_reload", false);
    };
    main_logger = logger;
    return {
      command: "anti_app_restriction",
      aliases: ["aar"],
      description: "bypass azota's app restriction and allow you to take a test on web without requiring the azota student app.",
      is_toggle: true,
      callback_fn: main
    };
  };

  // index.js
  var logger = new import_kumiyui4.Logger({ name: "azota_cheat", level: import_kumiyui4.Logger.LEVELS.info });
  [
    anti_fullscreen_bypass(),
    no_timer(),
    anti_app_restriction(logger.child("anti_app_restriction"))
  ].forEach((command) => {
    import_kumiyui4.Command(command);
  });
})();
