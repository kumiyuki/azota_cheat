// ==UserScript==
// @name            azota_cheat
// @version         2.2.8
// @namespace       https://github.com/kumiyuki/azota_cheat/
// @description     cheat for azota.vn platform
// @author          kumiyuki
// @include         /^https?:\/\/azota\.vn\/.*\/de-thi\/.*$/
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
// ==/UserScript==

"use strict";
// node_modules/kumiyui/modules/utils/dropin_console.js
var document2 = window.document;

class DropInConsole {
  constructor(commandHandler) {
    this.isOpen = false;
    this.commandHandler = commandHandler || ((cmd) => this.printLevel("error", `No handler: ${cmd}`));
    this._buildUI();
  }
  _buildUI() {
    const host = document2.createElement("div");
    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    const shadow = host.attachShadow({ mode: "open" });
    const container = document2.createElement("div");
    container.style.cssText = "position:fixed;bottom:0;left:0;width:100vw;height:50vh;background:#111;color:#fff;font-family:monospace;font-size:13px;box-shadow:0 -5px 15px rgba(0,0,0,0.5);display:flex;flex-direction:column;transform:translateY(100%);transition:transform 0.2s ease-in-out;box-sizing:border-box;";
    const header = document2.createElement("div");
    header.style.cssText = "background:#222;padding:8px 12px;display:flex;justify-content:space-between;border-bottom:1px solid #333;align-items:center;";
    const title = document2.createElement("span");
    title.style.cssText = "color:#aaa;font-weight:bold;";
    title.textContent = "\uD83D\uDEE0️ Terminal";
    const end_group = document2.createElement("div");
    end_group.style.cssText = "display:flex;gap:8px;align-items:center;";
    const clearBtn = document2.createElement("button");
    clearBtn.style.cssText = "background:none;border:none;color:#ff9999;cursor:pointer;font-weight:bold;font-size:14px;padding:4px;";
    clearBtn.textContent = "⌀ Clear";
    clearBtn.addEventListener("click", () => {
      if (typeof this?.output?.replaceChildren === "function")
        this.output.replaceChildren();
    });
    const closeBtn = document2.createElement("button");
    closeBtn.style.cssText = "background:none;border:none;color:#f55;cursor:pointer;font-weight:bold;font-size:14px;padding:4px;";
    closeBtn.textContent = "✕ Close";
    closeBtn.addEventListener("click", () => this.toggle());
    header.appendChild(title);
    end_group.appendChild(clearBtn);
    end_group.appendChild(closeBtn);
    header.appendChild(end_group);
    this.output = document2.createElement("div");
    this.output.style.cssText = "flex:1;overflow-y:auto;padding:0;white-space:pre;line-height:1.4;";
    const inputContainer = document2.createElement("div");
    inputContainer.style.cssText = "background:#1a1a1a;padding:8px;border-top:1px solid #333;display:flex;align-items:center;";
    this.inputField = document2.createElement("input");
    this.inputField.type = "text";
    this.inputField.placeholder = "input command...";
    this.inputField.style.cssText = "flex:1;background:#252525;border:1px solid #444;color:#0f0;font-family:monospace;font-size:14px;padding:8px 10px;border-radius:4px;outline:none;";
    this.inputField.addEventListener("keydown", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.key === "Enter" && this.inputField.value) {
        const cmd = this.inputField.value.trim();
        if (cmd) {
          this.printLevel("log", `> ${cmd}`);
          this.commandHandler(cmd);
          this.inputField.value = "";
        }
      }
    }, { capture: true });
    ["input", "keyup", "change"].forEach((event) => {
      this.inputField.addEventListener(event, (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }, { capture: true });
    });
    inputContainer.appendChild(this.inputField);
    container.appendChild(header);
    container.appendChild(this.output);
    container.appendChild(inputContainer);
    shadow.appendChild(container);
    let is_added = false;
    const append_host = () => {
      if (is_added || !document2.body)
        return;
      document2.body.appendChild(host);
      is_added = true;
    };
    if (document2.body) {
      append_host();
    } else {
      const _obs = new MutationObserver((mutations, obs) => {
        if (document2.body) {
          append_host();
          obs.disconnect();
        }
      });
      _obs.observe(document2.documentElement, {
        childList: true,
        subtree: true
      });
      window.addEventListener("DOMContentLoaded", () => {
        if (document2.body)
          append_host();
        _obs.disconnect();
      });
    }
    this.panel = container;
  }
  toggle() {
    this.isOpen = !this.isOpen;
    this.panel.style.transform = this.isOpen ? "translateY(0)" : "translateY(100%)";
    if (this.isOpen) {
      setTimeout(() => this.inputField.focus(), 250);
    } else {
      this.inputField.blur();
    }
  }
  trace(...args) {
    this.printLevel("debug", ...args);
  }
  debug(...args) {
    this.printLevel("debug", ...args);
  }
  log(...args) {
    this.printLevel("log", ...args);
  }
  info(...args) {
    this.printLevel("log", ...args);
  }
  table(data) {
    this.printLevel("log", data);
  }
  warn(...args) {
    this.printLevel("warn", ...args);
  }
  error(...args) {
    this.printLevel("error", ...args);
  }
  printLevel(level, ...args) {
    const len = args.length;
    if (len === 0)
      return;
    const line = document2.createElement("div");
    line.style.cssText = "padding:6px 10px;border-bottom:1px solid #222;display:block;";
    if (level === "error") {
      line.style.cssText += "background-color:rgba(255,85,85,0.12);color:#ff6b6b;border-left:3px solid #ff5555;";
    } else if (level === "warn") {
      line.style.cssText += "background-color:rgba(255,180,84,0.1);color:#ffb454;border-left:3px solid #ffb454;";
    } else if (level === "debug") {
      line.style.cssText += "color:#7ec0ee;";
    }
    const fragment = document2.createDocumentFragment();
    const timeSpan = document2.createElement("span");
    timeSpan.style.cssText = "color:#555;margin-right:5px;";
    timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`;
    fragment.appendChild(timeSpan);
    const firstArg = args[0];
    if (typeof firstArg === "string" && firstArg.includes("%c")) {
      const parts = firstArg.split("%c");
      const partsLen = parts.length;
      if (partsLen > 0) {
        const initialSpan = document2.createElement("span");
        initialSpan.textContent = parts[0];
        fragment.appendChild(initialSpan);
      }
      let styleIdx = 1;
      for (let i = 1;i < partsLen; i++) {
        const span = document2.createElement("span");
        span.textContent = parts[i];
        const styleVal = args[styleIdx];
        if (typeof styleVal === "string") {
          span.style.cssText = styleVal;
          styleIdx++;
        }
        fragment.appendChild(span);
      }
      for (let i = styleIdx;i < len; i++) {
        fragment.appendChild(document2.createTextNode(" "));
        fragment.appendChild(this._renderItem(args[i]));
      }
    } else {
      for (let i = 0;i < len; i++) {
        if (i > 0)
          fragment.appendChild(document2.createTextNode(" "));
        fragment.appendChild(this._renderItem(args[i]));
      }
    }
    line.appendChild(fragment);
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }
  _renderItem(item) {
    const span = document2.createElement("span");
    const type = typeof item;
    if (item === null) {
      span.textContent = "null";
      span.style.color = "#777";
    } else if (item === undefined) {
      span.textContent = "undefined";
      span.style.color = "#777";
    } else if (type === "object") {
      if (Array.isArray(item) && item.length > 0 && typeof item[0] === "object" && item[0] !== null) {
        span.appendChild(this._createAsciiTable(item));
      } else {
        try {
          span.textContent = JSON.stringify(item);
          span.style.color = "#a8ff60";
        } catch (e) {
          span.textContent = String(item);
        }
      }
    } else if (type === "number") {
      span.textContent = String(item);
      span.style.color = "#ffb454";
    } else if (type === "boolean") {
      span.textContent = String(item);
      span.style.color = "#ff55f3";
    } else {
      span.textContent = String(item);
    }
    return span;
  }
  _createAsciiTable(arrayData) {
    const pre = document2.createElement("pre");
    pre.style.cssText = "margin:5px 0;background:#1a1a1a;padding:6px;border-radius:4px;color:#55ffff;overflow-x:auto;white-space:pre;font-family:monospace;";
    try {
      const headers = ["(index)", ...new Set(arrayData.flatMap((obj) => Object.keys(obj)))];
      const rows = arrayData.map((obj, index) => headers.map((header) => header === "(index)" ? String(index) : String(obj[header] !== undefined ? obj[header] : "")));
      const colWidths = headers.map((header, colIdx) => Math.max(header.length, ...rows.map((row) => row[colIdx].length)));
      const makeDivider = () => "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + `
`;
      const makeRowStr = (cells) => "| " + cells.map((cell, idx) => cell.padEnd(colWidths[idx])).join(" | ") + ` |
`;
      let tableStr = makeDivider() + makeRowStr(headers) + makeDivider();
      const rLen = rows.length;
      for (let i = 0;i < rLen; i++) {
        tableStr += makeRowStr(rows[i]);
      }
      tableStr += makeDivider();
      pre.textContent = tableStr;
    } catch (err) {
      pre.textContent = `[Table Error: ${err.message}]`;
      pre.style.color = "#ff5555";
    }
    return pre;
  }
}

// node_modules/kumiyui/modules/logger.js
var console = window.console;
var ui_console = null;
var VALID_LEVELS = new Set([10, 20, 30, 40, 50, Infinity]);
var LEVELS_INT = new Map([
  [10, "TRACE"],
  [20, "DEBUG"],
  [30, "INFO"],
  [40, "WARN"],
  [50, "ERROR"]
]);

class Logger {
  static LEVELS = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    silent: Infinity
  };
  static COLORS = {
    10: "color: #888888;",
    20: "color: #06b6d4;",
    30: "color: #10b981; font-weight: bold;",
    40: "color: #f59e0b; font-weight: bold;",
    50: "color: #ef4444; font-weight: bold;"
  };
  constructor({ name = "kumiyui", level = "info", output_timestamp = false }) {
    this.name = name;
    this.output_timestamp = output_timestamp;
    if (typeof level === "number") {
      this.level_weight = VALID_LEVELS.has(level) ? level : 30;
    } else if (typeof level === "string") {
      this.level_weight = Logger.LEVELS[level] ?? 30;
    } else {
      this.level_weight = 30;
    }
  }
  set level(new_level) {
    if (typeof new_level === "number") {
      this.level_weight = VALID_LEVELS.has(new_level) ? new_level : 30;
    } else if (typeof new_level === "string") {
      this.level_weight = Logger.LEVELS[new_level] ?? 30;
    } else {
      this.level_weight = 30;
    }
  }
  child(child_name) {
    return new Logger({
      name: `${this?.name}:${child_name}`,
      level: this.level_weight
    });
  }
  _log(method, weight, args) {
    if (weight < this.level_weight)
      return;
    const prefix = `[${this?.name}]`;
    const allow_timestamp = this.output_timestamp;
    const output_styles = [];
    if (allow_timestamp === true)
      output_styles.push(Logger.COLORS[10]);
    output_styles.push(Logger.COLORS[weight ?? 30]);
    const timestamp_output = allow_timestamp === true ? `%c[${new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(11, 23)}]` + " " : "";
    const rendered_output = [`${timestamp_output}%c${LEVELS_INT.get(weight ?? 30)}`, ...output_styles, prefix];
    if (method === "table") {
      console.log(...rendered_output);
      console.table(...args);
      if (typeof ui_console.log !== "function" && typeof ui_console.table !== "function")
        return;
      ui_console.log(...rendered_output);
      ui_console.table(...args);
      return;
    }
    console?.[method](...rendered_output, ...args);
    if (typeof ui_console?.[method] === "function")
      ui_console[method](...rendered_output, ...args);
  }
  trace(...args) {
    this._log("debug", 10, args);
  }
  debug(...args) {
    this._log("debug", 20, args);
  }
  info(...args) {
    this._log("info", 30, args);
  }
  table(...args) {
    this._log("table", 30, args);
  }
  warn(...args) {
    this._log("warn", 40, args);
  }
  error(...args) {
    this._log("error", 50, args);
  }
}
var _set_trigger_command_input = (trigger_command_input) => {
  ui_console = new DropInConsole(trigger_command_input);
  return ui_console;
};
var host = document.createElement("div");
host.style.cssText = "position:fixed!important;bottom:20px!important;right:20px!important;z-index:2147483647!important;width:40px!important;height:40px!important;pointer-events:none!important;";
var shadow_root = host.attachShadow({ mode: "closed" });
var trigger_div = document.createElement("div");
trigger_div.style.cssText = "display:none!important;pointer-events:auto!important;cursor:pointer!important;width:40px!important;height:40px!important;padding:8px!important;background-color:#000!important;opacity:.25!important;position:fixed!important;border-radius:10px!important;box-sizing:border-box!important;transition:opacity .2s ease!important;user-select:none!important;touch-action:none!important;";
var is_dragging = false;
var offset_x;
var offset_y;
var start_drag = (e) => {
  is_dragging = true;
  const client_x = e.touches ? e.touches[0].clientX : e.clientX;
  const client_y = e.touches ? e.touches[0].clientY : e.clientY;
  offset_x = client_x - trigger_div.offsetLeft;
  offset_y = client_y - trigger_div.offsetTop;
};
var move_drag = (e) => {
  if (!is_dragging)
    return;
  const client_x = e.touches ? e.touches[0].clientX : e.clientX;
  const client_y = e.touches ? e.touches[0].clientY : e.clientY;
  trigger_div.style.left = `${client_x - offset_x}px`;
  trigger_div.style.top = `${client_y - offset_y}px`;
};
var stop_drag = () => is_dragging = false;
trigger_div.addEventListener("touchstart", start_drag, { passive: true });
document.addEventListener("touchmove", move_drag, { passive: false });
document.addEventListener("touchend", stop_drag);
trigger_div.addEventListener("mousedown", start_drag);
document.addEventListener("mousemove", move_drag);
document.addEventListener("mouseup", stop_drag);
trigger_div.addEventListener("mouseenter", () => trigger_div.style.opacity = "0.8");
trigger_div.addEventListener("mouseleave", () => trigger_div.style.opacity = "0.25");
trigger_div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#e3e3e3"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`;
trigger_div.addEventListener("click", () => {
  if (ui_console)
    ui_console.toggle();
});
shadow_root.appendChild(trigger_div);
(document.documentElement || document.body).appendChild(host);
var curr_input_mode = null;
window.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== curr_input_mode) {
    curr_input_mode = e.pointerType;
    trigger_div.style.display = curr_input_mode === "touch" ? "block" : "none";
  }
});

// node_modules/kumiyui/modules/hook_masker.js
var logger = new Logger({ name: "kumiyui:hook_masker", level: Logger.LEVELS.info });
var _hooks = new Map;
var bypass_detection_hook = (hook_env) => {
  if (!hook_env || !hook_env?.Function?.prototype)
    return;
  const o_fn_c = hook_env?.Function?.prototype?.toString?.call?.bind(hook_env.Function.prototype.toString);
  try {
    const new_tostring_hook = (...args) => {
      for (const _obj of args) {
        if (typeof _obj !== "function")
          return;
      }
      if (args.length <= 0)
        return o_fn_c(...args);
      if (_hooks.has(args[0]))
        return _hooks.get(args[0]) || "function() { [native code] }";
      return o_fn_c(...args);
    };
    Object.defineProperty(hook_env.Function.prototype.toString, "call", {
      get: () => new_tostring_hook,
      set: () => new_tostring_hook,
      configurable: true
    });
    _hooks.set(hook_env.Function.prototype.toString, "function toString() { [native code] }");
  } catch (e) {
    logger.error(`failed to mask Function.prototype.call()`, e);
  }
  try {
    const obj_fn_c = hook_env?.Object?.prototype?.constructor?.toString;
    const new_obj_tostring_hook = (...args) => {
      if (args.length <= 0)
        return obj_fn_c(...args);
      if (_hooks.has(args[0]))
        return _hooks.get(args[0]) || "function() { [native code] }";
      return obj_fn_c(...args);
    };
    Object.defineProperty(hook_env.Object.prototype.constructor, "toString", {
      get: () => new_obj_tostring_hook,
      set: () => new_obj_tostring_hook,
      configurable: true
    });
  } catch (e) {
    logger.error(`failed to mask Function.prototype.constructor.toString()`, e);
  }
};
bypass_detection_hook(unsafeWindow || window);
var o_appendc = Element?.prototype?.appendChild;
Element.prototype.appendChild = function(...args) {
  if ((args.length ?? 0) <= 0)
    return o_appendc.apply(this, args);
  const child = args[0];
  const result = o_appendc.apply(this, args);
  if (child instanceof HTMLIFrameElement) {
    if (child?.contentWindow)
      bypass_detection_hook(child?.contentWindow);
    child?.addEventListener("load", () => {
      if (child?.contentWindow)
        bypass_detection_hook(child?.contentWindow);
    });
    try {
      Object.defineProperty(child, "contentWindow", {
        get: function() {
          const win = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow").get.call(this);
          if (win) {
            try {
              if (!win.Function.prototype.toString.toString().includes("[native code]"))
                bypass_detection_hook(win);
            } catch (e) {
              logger.debug("(you can safely ignore this warning) this is a cross-origin frame. direct manipulation from here is blocked by the browser. detailed log:", e);
            }
          }
          return win;
        },
        configurable: true
      });
    } catch (e) {
      logger.error(`cross context navigation reset watcher threw error:`, e);
    }
  }
  return result;
};
var mask_hook = (fn, native_string) => {
  if (typeof fn !== "function")
    return;
  if (_hooks.has(fn))
    return;
  const hook_native = typeof native_string === "string" ? native_string : "function() { [native code] }";
  _hooks.set(fn, hook_native);
  const o_hasprop = fn?.hasOwnProperty;
  try {
    if (typeof o_hasprop === "function") {
      const modified_hasOwnProperty = function(...args) {
        if ((args.length ?? 0) <= 0)
          return o_hasprop.apply(this, args);
        if (args[0] === "toString" || args[0] === "hasOwnProperty")
          return false;
        return o_hasprop.apply(this, args);
      };
      Object.defineProperty(fn, "hasOwnProperty", {
        get: () => modified_hasOwnProperty,
        set: () => modified_hasOwnProperty,
        configurable: true
      });
      _hooks.set(fn.hasOwnProperty, "function hasOwnProperty() { [native code] }");
    }
  } catch (e) {
    logger.error(`failed to mask fn.hasOwnProperty()`, e);
  }
  try {
    const modified_toString = function() {
      return hook_native;
    };
    Object.defineProperty(fn, "toString", {
      get: () => modified_toString,
      set: () => modified_toString,
      configurable: true
    });
    _hooks.set(fn.toString, "function toString() { [native code] }");
  } catch (e) {
    logger.error(`failed to mask fn.toString()`, e);
  }
};

// node_modules/kumiyui/modules/hook.js
var o_fn_c = window?.Function?.prototype?.toString?.call?.bind(window?.Function?.prototype?.toString);
var logger2 = new Logger({ name: "kumiyui:hook", level: Logger.LEVELS.info });
var apply_raw_hook = ({ obj, prop, new_value, options, native_str }) => {
  try {
    Object.defineProperty(obj, prop, {
      value: new_value,
      writable: options?.block_overwrite === true ? false : true
    });
  } catch (e) {
    logger2.error(`failed to hook ${obj}[${prop}], error:`, e);
  }
  if (options?.mask_hook === true && native_str)
    return mask_hook(obj[prop], native_str);
};
var hook = ({
  obj,
  prop,
  new_value,
  options = {
    mask_hook: false,
    block_overwrite: false
  }
}) => {
  const native_str = typeof obj?.[prop] === "function" ? o_fn_c(obj?.[prop])?.toString() : null;
  if (obj === window)
    obj = typeof unsafeWindow !== "undefined" ? unsafeWindow : globalThis || window;
  apply_raw_hook({ obj, prop, new_value, options, native_str });
};

// node_modules/kumiyui/modules/network.js
var o_fetch = globalThis.fetch || window.fetch;
var o_send_beacon = globalThis?.navigator?.sendBeacon || window?.navigator?.sendBeacon;
var o_xhr = globalThis.XMLHttpRequest || window.XMLHttpRequest;
var logger3 = new Logger({ name: "kumiyui:hook_masker", level: Logger.LEVELS.info });
var is_json = (str) => {
  if (typeof str !== "string")
    return false;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
var await_after_hook = async (env, state) => {
  if (env?.readyState === 4 && state?._kumiyui_finished === true || state?._kumiyui_blocked === true)
    return;
  if (env?.readyState === 4 && !state._kumiyui_finished) {
    await new Promise((resolve) => {
      state?._kumiyui_change_listeners.push(resolve);
      if (state._kumiyui_finished === true || state._kumiyui_blocked === true) {
        const listener_index = state._kumiyui_change_listeners.indexOf(resolve);
        if (listener_index !== -1)
          state._kumiyui_change_listeners.splice(listener_index, 1);
        return resolve();
      }
    });
  }
};
var hook_registry = { before: [], after: [] };
var _init_network_hook = () => {
  hook({
    obj: window,
    prop: "fetch",
    new_value: async (...args) => {
      let context = { args, api: "fetch" };
      let short_circuit_response = null;
      let is_execution_blocked = false;
      let cached_json_body = [];
      let is_json_parsed = [];
      Object.defineProperty(context, "json", {
        get() {
          if (is_json_parsed)
            return cached_json_body;
          const options = this?.args[1];
          if (options && options?.body && typeof options?.body === "string") {
            try {
              cached_json_body = JSON.parse(options?.body);
            } catch (e) {
              cached_json_body = null;
            }
          }
          is_json_parsed = true;
          return cached_json_body;
        },
        set(new_value) {
          cached_json_body = new_value;
          is_json_parsed = true;
          if (this?.args[0] instanceof Request) {
            this.args[0] = new Request(this.args[0], {
              method: this.args[0].method,
              headers: this.args[0].headers,
              body: JSON.stringify(new_value)
            });
          } else {
            this.args[1] = { ...this.args[1] };
            this.args[1].body = JSON.stringify(new_value);
            if (!this.args[1].method || this.args[1].method === "GET")
              this.args[1].method = "POST";
          }
        }
      });
      for (const hook of hook_registry.before) {
        try {
          let modification = null;
          try {
            modification = await hook(context);
          } catch (e) {
            logger3.error(`cannot execute hook listener on window.fetch() hook (type: "before"), error:`, e);
          }
          if (modification !== undefined) {
            if (modification === false) {
              short_circuit_response = undefined;
              is_execution_blocked = true;
              break;
            }
            let _response = { status: 200, statusText: "OK", headers: new Headers };
            let response_body = null;
            if (modification && typeof modification === "object") {
              ["status", "statusText", "headers"].forEach((_res_key) => {
                if (modification[_res_key] !== undefined)
                  _response[_res_key] = modification[_res_key];
              });
              response_body = modification?.body !== undefined ? modification.body : null;
            } else if (typeof modification === "string") {
              response_body = modification;
            }
            short_circuit_response = new Response(response_body, _response);
            break;
          }
        } catch (e) {
          logger3.error(`failed to hook networt request (type: "before"), error:`, e);
        }
      }
      let response;
      if (short_circuit_response && !is_execution_blocked) {
        response = short_circuit_response;
      } else if (!short_circuit_response && is_execution_blocked === true) {
        response = undefined;
        return;
      } else {
        try {
          response = await o_fetch.apply(window, context?.args);
        } catch (net_err) {
          logger3.log("failed to send real network request to the server.", net_err);
          throw net_err;
        }
      }
      const after_hooks = hook_registry?.after ?? [];
      for (let i = 0;i < after_hooks?.length; i++) {
        try {
          const hook = after_hooks[i];
          const is_last_hook = i === (after_hooks?.length ?? 0) - 1;
          const response_for_hook = is_last_hook ? response : response.clone();
          let modification = null;
          try {
            modification = await hook(context, response_for_hook);
          } catch (e) {
            logger3.error(`cannot execute hook listener on window.fetch() hook (type: "after"), error:`, e);
          }
          if (modification !== undefined) {
            if (modification instanceof Response) {
              response = modification;
            } else {
              let _response = { status: 200, statusText: "OK", headers: new Headers };
              if (modification && typeof modification === "object" && (modification["body"] !== undefined || modification["status"] !== undefined)) {
                ["status", "statusText", "headers"].forEach((_res_key) => {
                  if (modification[_res_key] !== undefined)
                    _response[_res_key] = modification[_res_key];
                });
              }
              response = new Response(modification?.body, _response);
            }
          }
        } catch (e) {
          logger3.error(`error on "after" hook, error:`, e);
        }
      }
      return response;
    },
    options: { mask_hook: true, block_overwrite: true }
  });
  if (window.navigator && o_send_beacon) {
    hook({
      obj: window.navigator,
      prop: "sendBeacon",
      new_value: (url, data) => {
        const context = { args: [url, data], api: "sendBeacon" };
        let is_blocked = false;
        Object.defineProperty(context, "json", {
          get() {
            if (typeof this?.args[1] === "string") {
              try {
                return JSON.parse(this.args[1]);
              } catch (e) {}
              return null;
            }
          },
          set(value) {
            this.args[1] = JSON.stringify(value);
          }
        });
        for (const hook of hook_registry?.before) {
          try {
            let modification = null;
            try {
              modification = hook(context);
            } catch (e) {
              logger3.error(`cannot execute hook listener on sendBeacon hook (type: "before"), error:`, e);
            }
            if (modification === false || modification && typeof modification === "object" && modification.status === 204) {
              is_blocked = true;
              break;
            }
          } catch (e) {
            logger3.error(`error on sendBeacon hook (type: "before"), error:`, e);
          }
        }
        if (is_blocked === true)
          return true;
        const result = o_send_beacon.apply(window.navigator, context.args);
        for (const hook of hook_registry?.after) {
          try {
            hook(context, result);
          } catch (e) {
            logger3.error(`cannot execute hook listener on sendBeacon hook (type: "after"), error:`, e);
          }
        }
        return result;
      },
      options: { mask_hook: true, block_overwrite: true }
    });
  }
  const xhr_hook_map = new WeakMap;
  const xhr_before = async (state) => {
    for (const hook2 of hook_registry?.before) {
      try {
        const modification = await hook2(state._kumiyui_context);
        let _response = { status: 200, statusText: "OK", headers: new Headers, body: null, send_to_server: false };
        if (modification !== undefined) {
          if (modification === false) {
            state._kumiyui_response.body = null;
            state._kumiyui_blocked = true;
            hook({ obj: null, prop: "send", new_value: () => {}, options: { mask_hook: true, block_overwrite: true } });
            break;
          }
          if (typeof modification === "object") {
            ["status", "statusText", "headers", "body", "send_to_server"].forEach((_res_key) => {
              if (modification[_res_key] !== undefined)
                _response[_res_key] = modification[_res_key];
              else if (_res_key === "send_to_server")
                _response["send_to_server"] = false;
            });
            state._kumiyui_response = _response;
          } else if (typeof modification === "string") {
            _response["body"] = modification;
            state._kumiyui_response = _response;
          }
          break;
        }
      } catch (e) {
        logger3.error(`cannot execute hook listener on XHR hook (type: "before", first call), error:`, e);
      }
    }
  };
  hook({
    obj: window,
    prop: "XMLHttpRequest",
    new_value: class extends o_xhr {
      constructor() {
        super();
        let finished_state = false;
        const self = this;
        xhr_hook_map.set(this, {
          _kumiyui_queued_headers: [],
          _kumiyui_has_to_queue_response: false,
          _kumiyui_queued_response: null,
          _kumiyui_is_opened: false,
          _kumiyui_send_triggered: false,
          _kumiyui_context: { args: ["", null], method: "GET", api: "xhr", before_state: null },
          _kumiyui_response: {
            status: null,
            statusText: null,
            headers: null,
            body: null,
            responseType: null,
            send_to_server: true
          },
          _kumiyui_blocked: false,
          _kumiyui_event_listeners: new WeakMap,
          _kumiyui_change_listeners: [],
          get _kumiyui_finished() {
            return finished_state;
          },
          set _kumiyui_finished(new_value) {
            if (finished_state === new_value)
              return;
            finished_state = new_value;
            if (new_value === true) {
              const state = xhr_hook_map.get(self);
              while (state?._kumiyui_change_listeners.length > 0) {
                const resolve_hook = state._kumiyui_change_listeners.shift();
                if (typeof resolve_hook === "function")
                  resolve_hook();
              }
            }
          }
        });
      }
      async open(method, url, ...args) {
        const state = xhr_hook_map.get(this);
        state._kumiyui_context.method = method;
        state._kumiyui_context.args[0] = url;
        state._kumiyui_context.before_state = "url";
        await xhr_before(state);
        const open_native = super.open(method, state._kumiyui_context.args[0], ...args);
        state._kumiyui_is_opened = true;
        while (state._kumiyui_queued_headers.length > 0) {
          super.setRequestHeader(...state._kumiyui_queued_headers.shift());
        }
        if (state._kumiyui_has_to_queue_response === true) {
          super.send(state._kumiyui_queued_response);
        }
        return open_native;
      }
      setRequestHeader(...args) {
        const state = xhr_hook_map.get(this);
        if (!state._kumiyui_is_opened || super.readyState < 1) {
          state._kumiyui_queued_headers.push(args);
        } else {
          super.setRequestHeader(...args);
          try {
            super.setRequestHeader(...args);
          } catch (e) {
            logger3.error("cannot perform setRequestHeader() on xhr hook, error:", e);
          }
        }
      }
      get response() {
        const state = xhr_hook_map.get(this);
        if (state._kumiyui_finished === false)
          return null;
        if (state._kumiyui_response?.body === null)
          return !state._kumiyui_blocked ? super.response : null;
        const r_body = state._kumiyui_response?.body;
        const headers = state._kumiyui_response?.headers || {};
        const b_type = state._kumiyui_response?.responseType !== null ? state._kumiyui_response?.responseType : !state._kumiyui_blocked ? super.responseType : null;
        try {
          switch (b_type) {
            case "json":
              return JSON.parse(r_body);
            case "document":
              return new DOMParser().parseFromString(r_body, "text/html");
            case "arraybuffer":
              return new TextEncoder().encode(r_body).buffer;
            case "blob":
              const content_type_header = headers["content-type"] || headers["Content-Type"] || "";
              const mime_type = content_type_header.split(";")[0].replaceAll(" ", "") || "application/octet-stream";
              return new Blob([r_body], { type: mime_type });
            case "text":
              return r_body;
            default:
              return r_body;
          }
        } catch (e) {
          logger3.error(`failed to parse property response, maybe server sent a malformed response, error:`, e);
          return null;
        }
      }
      get responseText() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.body !== null ? state._kumiyui_response.body : !state._kumiyui_blocked ? super.responseText : "";
      }
      get status() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.status !== null ? state._kumiyui_response.status : !state._kumiyui_blocked ? super.status : 0;
      }
      get statusText() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.statusText !== null ? state._kumiyui_response.statusText : !state._kumiyui_blocked ? super.statusText : 0;
      }
      get readyState() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_blocked !== true && state._kumiyui_finished ? super.readyState : 3;
      }
      getResponseHeader(...data) {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.headers !== null ? (state._kumiyui_response.headers?.get ?? (() => {}))(...data) : !state._kumiyui_blocked ? super.getResponseHeader(...data) : null;
      }
      getAllResponseHeaders(...data) {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.headers !== null ? (state._kumiyui_response.headers?.getAll ?? (() => {}))(...data) : !state._kumiyui_blocked ? super.getAllResponseHeaders(...data) : "";
      }
      set onreadystatechange(on_state_change_fn) {
        super.onreadystatechange = async (..._o_args) => {
          const state = xhr_hook_map.get(this);
          await await_after_hook({ readyState: super.readyState }, state);
          if (typeof on_state_change_fn === "function") {
            try {
              on_state_change_fn.apply(this, _o_args);
            } catch (e) {
              logger3.error("cannot execute function onreadystatechange() on xhr hook, error:", e);
            }
          }
        };
      }
      set onload(onload_fn) {
        super.onload = async (..._o_args) => {
          const state = xhr_hook_map.get(this);
          await await_after_hook({ readyState: super.readyState }, state);
          if (typeof onload_fn === "function") {
            try {
              onload_fn.apply(this, _o_args);
            } catch (e) {
              logger3.error("cannot execute function onload() on xhr hook, error:", e);
            }
          }
        };
      }
      addEventListener(...args) {
        const event_type = args[0];
        const listener = args[1];
        if (event_type !== "readystatechange" && event_type !== "load")
          return super.addEventListener(...args);
        const state = xhr_hook_map.get(this);
        const hook_wrapped_listener = async (..._o_args) => {
          await await_after_hook({ readyState: super.readyState }, state);
          if (typeof listener === "function") {
            try {
              listener.apply(this, _o_args);
            } catch (e) {
              logger3.error("cannot execute function given on the second argument of addEventListener() at xhr hook, error:", e);
            }
          }
        };
        if (!state._kumiyui_event_listeners)
          state._kumiyui_event_listeners = new WeakMap;
        state._kumiyui_event_listeners.set(listener, hook_wrapped_listener);
        return super.addEventListener(event_type, hook_wrapped_listener, ...args.splice(2));
      }
      removeEventListener(...args) {
        const state = xhr_hook_map.get(this);
        const event_type = args[0];
        const listener = args[1];
        if (state._kumiyui_event_listeners && state._kumiyui_event_listeners.has(listener)) {
          const wrapped = state._kumiyui_event_listeners.get(listener);
          return super.removeEventListener(event_type, wrapped, ...args.splice(2));
        }
        return super.removeEventListener(event_type, listener, ...args.splice(2));
      }
      async send(body) {
        const state = xhr_hook_map.get(this);
        if (state._kumiyui_send_triggered === true)
          return super.send(body);
        state._kumiyui_context.args[1] = body;
        state._kumiyui_context.before_state = "body";
        const context = state._kumiyui_context;
        Object.defineProperty(this, "json", {
          get() {
            const r_body = context?.args[1];
            if (typeof r_body === "string") {
              try {
                return JSON.parse(r_body);
              } catch (e) {
                logger3.error("cannot parse JSON with json() at xhr hook, error:", e);
              }
              return null;
            }
          },
          set(value) {
            context.args[1] = JSON.stringify(value);
          }
        });
        await xhr_before(state);
        if (state._kumiyui_blocked === true)
          return;
        super.addEventListener("readystatechange", async () => {
          if (hook_registry?.after?.length <= 0) {
            state._kumiyui_finished = true;
            return;
          }
          if (super.readyState !== 4)
            return;
          let simulated_res = new Response(super.response, {
            status: super.status,
            statusText: super.statusText,
            headers: new Headers((this.getAllResponseHeaders() || "").split(`\r
`).reduce((acc, line) => {
              const [k, v] = line.split(": ");
              if (k)
                acc[k] = v;
              return acc;
            }, {}))
          });
          for (const hook of hook_registry?.after) {
            try {
              const clone = simulated_res.clone();
              let _response = { status: 200, statusText: "OK", headers: new Headers, body: null, send_to_server: false };
              let mod = null;
              try {
                mod = await hook(context, clone);
              } catch (e) {
                logger3.error(`cannot execute hook listener on XHR hook (type: "after"), error:`, e);
              }
              if (typeof mod === "object" && mod !== null) {
                ["status", "statusText", "headers", "body", "send_to_server"].forEach((_res_key) => {
                  if (mod[_res_key] !== undefined)
                    _response[_res_key] = mod[_res_key];
                  else if (_res_key === "send_to_server")
                    _response["send_to_server"] = false;
                });
                state._kumiyui_response = _response;
              } else if (typeof mod === "string") {
                _response["body"] = mod;
                state._kumiyui_response = _response;
              }
            } catch (e) {
              logger3.error(`error on XHR hook (type: "after"), error:`, e);
            }
          }
          state._kumiyui_finished = true;
        });
        if (!state._kumiyui_is_opened || super.readyState < 1) {
          state._kumiyui_has_to_queue_response = true;
          state._kumiyui_queued_response = context.args[1];
        } else {
          try {
            if (state._kumiyui_blocked === true || state._kumiyui_response?.send_to_server === false)
              return;
            const native_send = super.send(context.args[1]);
            state._kumiyui_send_triggered = true;
            return native_send;
          } catch (e) {
            logger3.error("cannot perform send() on xhr hook, error:", e);
          }
        }
      }
    },
    options: { mask_hook: true, block_overwrite: true }
  });
};
_init_network_hook();
var register_network_hook = (type, callback) => {
  hook_registry[type]?.push(callback);
};

// node_modules/kumiyui/modules/store.js
var g_get;
var g_set;
var tmp_db = undefined;
if (typeof GM_getValue === "function" && typeof GM_setValue === "function") {
  g_get = (key, fallback) => typeof GM_getValue === "function" ? GM_getValue(key, fallback) : fallback;
  g_set = (key, val) => typeof GM_setValue == "function" ? GM_setValue(key, val) : null;
} else {
  tmp_db = new Map;
  g_get = (key, fallback) => tmp_db.has(key) ? tmp_db.get(key) : fallback;
  g_set = (key, val) => tmp_db.set(key, val);
}
var get = g_get;
var set = g_set;

// node_modules/kumiyui/modules/command.js
var b64_encode = window.btoa;
var prompt = window.prompt;
var alert2 = window.alert;
var trigger_keys = new Map([
  [
    ":",
    {
      altKey: false,
      ctrlKey: false,
      shiftKey: true
    }
  ]
]);
var commands = new Map;
var active_toggles = new Map;
var userscript_menu_id = new Map;
var commands_metad = [];
var logger4 = new Logger({ name: "kumiyui:command", level: Logger.LEVELS.info });
var trigger_command_input = (command_str) => {
  const user_input = typeof command_str !== "string" ? prompt("input command:")?.toString() : command_str;
  if (typeof user_input !== "string" || user_input?.replaceAll(" ", "") === "")
    return;
  const split_input = user_input.split(" ");
  const command = split_input[0]?.toLowerCase();
  const args = split_input.splice(1);
  if (command === "kumiyui.disabledevtoolhelp")
    return set("kumiyui_internal_set__disabledevtoolhelp", true);
  if (!commands.has(command))
    return;
  const command_obj = commands.get(command);
  const callback_fn = typeof command_obj === "object" ? command_obj?.callback_fn : command_obj;
  if (typeof callback_fn !== "function")
    return;
  const main_command = typeof command_obj === "object" ? command_obj?.command : command;
  const has_toggle = active_toggles.has(main_command);
  let is_toggled = undefined;
  if (has_toggle) {
    const toggle_status = active_toggles.get(main_command) === true ? false : true;
    active_toggles.set(main_command, toggle_status);
    set(`toggle.${b64_encode(main_command)}`, toggle_status);
    is_toggled = toggle_status;
    if (userscript_menu_id.has(main_command))
      userscript_menu({
        command: main_command,
        is_toggle: has_toggle,
        is_enabled: toggle_status
      });
  }
  try {
    callback_fn(args, is_toggled);
  } catch (e) {
    logger4.error("failed to execute callback_fn(), error:", e);
  }
};
var userscript_menu = ({ command, is_toggle, is_enabled }) => {
  if (!is_toggle)
    return;
  if (typeof GM_registerMenuCommand !== "function" || typeof GM_unregisterMenuCommand !== "function")
    return;
  if (userscript_menu_id.has(command)) {
    const menu_id = userscript_menu_id.get(command);
    GM_unregisterMenuCommand(menu_id);
    userscript_menu_id.delete(command);
  }
  let userscript_label = `${command}: ${is_enabled ? "enabled" : "disabled"}`;
  const new_menu_obj = GM_registerMenuCommand(userscript_label, () => {
    if (!is_toggle)
      return;
    const prev_toggle_status = get(`toggle.${b64_encode(command)}`) ?? false;
    const toggle_status = prev_toggle_status === true ? false : true;
    active_toggles.set(command, toggle_status);
    set(`toggle.${b64_encode(command)}`, toggle_status);
    const command_obj = commands.get(command);
    const callback_fn = typeof command_obj === "object" ? command_obj?.callback_fn : command_obj;
    try {
      callback_fn([], toggle_status);
    } catch (e) {
      logger4.error("failed to execute callback_fn(), error:", e);
    }
    return userscript_menu({ command, is_toggle, is_enabled: toggle_status });
  });
  userscript_menu_id.set(command, new_menu_obj);
};
window.addEventListener("keydown", (event) => {
  const active_element = document.activeElement;
  if (active_element && (active_element.tagName === "INPUT" || active_element.tagName === "TEXTAREA" || active_element.isContentEditable))
    return;
  const e_key = event.key.toLowerCase();
  if (trigger_keys.has(e_key)) {
    const requirements = trigger_keys.get(e_key);
    for (const require_key of Object.keys(requirements)) {
      if (require_key === "key")
        continue;
      if (event[require_key] !== requirements[require_key])
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    trigger_command_input();
  }
});
var Command = ({ command, aliases, command_name, description, is_toggle, callback_fn }) => {
  if (typeof command !== "string" || typeof aliases !== "object" || typeof description !== "string" || typeof callback_fn !== "function" || !Array.isArray(aliases))
    return;
  command = command?.toString()?.toLowerCase();
  if (command === "kumiyui.disabledevtoolhelp")
    return logger4.debug("you cannot register kumiyui.disabledevtoolhelp because it's a framework command.");
  if (!commands.has(command))
    commands.set(command, callback_fn);
  else
    return logger4.debug(`the command ${command} has already been defined.`);
  commands_metad.push({
    command_name: typeof command_name === "string" && command_name?.toString().replaceAll(" ") !== "" ? command_name : command,
    command,
    aliases: aliases.join("; "),
    description,
    is_toggle
  });
  const command_enabled = get(`toggle.${b64_encode(command)}`, false);
  if (is_toggle === true)
    active_toggles.set(command, command_enabled);
  const aliases_obj = { command, callback_fn };
  aliases.forEach((_alt) => {
    const alt = _alt?.toString()?.toLowerCase();
    if (!commands.has(alt))
      commands.set(alt, aliases_obj);
    else
      return logger4.debug(`failed to define alternative command because the command ${command} has already been defined.`);
  });
  if (is_toggle === true)
    userscript_menu({
      command,
      is_toggle,
      is_enabled: command_enabled
    });
  if (command_enabled) {
    try {
      callback_fn([], command_enabled);
    } catch (e) {
      logger4.error("failed to execute callback_fn(), error:", e);
    }
  }
};
Command({
  command: "help",
  aliases: ["h", "tasukete", "cmd", "cmds", "kumiyui:cmd", "kumiyui::cmd", "kumiyui:cmds", "kumiyui::cmds"],
  command_name: "help",
  description: "get a list of commands",
  is_toggle: false,
  callback_fn: () => {
    if (get("kumiyui_internal_set__disabledevtoolhelp") !== true) {
      alert2(`please open console by using "kumiyui!c" command or use devtool's console (from browser).`);
      alert2(`to disable this popup before "help" command, you need to use the "kumiyui.disabledevtoolhelp" command.`);
    }
    logger4.table(commands_metad);
  }
});
var ui_console2 = null;
var _set_drop_in_console = (drop_in_console) => ui_console2 = drop_in_console;
Command({
  command: "kumiyui.console",
  aliases: ["kumiyui.c", "kumiyui!console", "kumiyui!c", "kumiyui:console", "kumiyui:c", "kumiyui::console", "kumiyui::c"],
  command_name: "kumiyui.console",
  description: "toggle DropInConsole module",
  is_toggle: false,
  callback_fn: () => {
    if (typeof ui_console2.toggle === "function")
      ui_console2.toggle();
  }
});
// node_modules/kumiyui/kumiyui.js
_set_drop_in_console(_set_trigger_command_input(trigger_command_input));

// modules/anti_fullscreen_bypass.js
var is_toggled = false;
register_network_hook("before", (context) => {
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
register_network_hook("after", async (context, response) => {
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
    if (toggle === true && get("no_timer_on_reload", false) !== true) {
      is_toggled2 = false;
      alert("please reload to load no_timer");
      set("no_timer_on_reload", true);
      return window.location.reload();
    }
    if (toggle === false)
      set("no_timer_on_reload", false);
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
var is_toggled3 = false;
var main_logger = null;
var _encode2 = null;
var _decode2 = null;
var potential_route = "frontexam/initdata";
register_network_hook("after", async (context, response) => {
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
      const is_json_res = is_json(response);
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
    if (toggle === true && get("aar_on_reload", false) !== true) {
      is_toggled3 = false;
      alert("please reload to load anti_app_restriction");
      set("aar_on_reload", true);
      return window.location.reload();
    }
    if (toggle === false)
      set("aar_on_reload", false);
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

// modules/vip_bypass.js
var is_toggled4 = false;
register_network_hook("after", async (context, response) => {
  if (!is_toggled4)
    return;
  const url = context.args[0]?.toString().toLowerCase().replaceAll(" ", "");
  if (url.includes("FrontExam/MustViewAds")) {
    const _json = await response.json() ?? {};
    _json.data = false;
    return {
      body: JSON.stringify(_json)
    };
  }
  if (url.includes("FrontVip/CheckVipObject")) {
    const _json = await response.json() ?? {};
    _json.data = true;
    return {
      body: JSON.stringify(_json)
    };
  }
});
var vip_bypass = () => {
  const main = (args, toggle) => {
    is_toggled4 = toggle;
    if (toggle === true && get("vip_bypass_on_reload", false) !== true) {
      is_toggled4 = false;
      alert("please reload to load vip_bypass");
      set("vip_bypass_on_reload", true);
      return window.location.reload();
    }
    if (toggle === false)
      set("vip_bypass_on_reload", false);
  };
  return {
    command: "vip_bypass",
    aliases: ["vip"],
    description: "disable ads and be able to attend the test without relying on teacher's VIP pack status.",
    is_toggle: true,
    callback_fn: main
  };
};

// index.js
var logger5 = new Logger({ name: "azota_cheat", level: Logger.LEVELS.info });
[
  anti_fullscreen_bypass(),
  no_timer(),
  anti_app_restriction(logger5.child("anti_app_restriction")),
  vip_bypass()
].forEach((command) => {
  Command(command);
});
