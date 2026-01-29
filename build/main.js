var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_ui();
  }
});

// src/app/messages.ts
var UI_TO_MAIN, MAIN_TO_UI;
var init_messages = __esm({
  "src/app/messages.ts"() {
    "use strict";
    UI_TO_MAIN = {
      BOOT: "BOOT",
      INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS"
    };
    MAIN_TO_UI = {
      BOOTSTRAPPED: "BOOTSTRAPPED",
      VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
      SELECTION_EMPTY: "SELECTION_EMPTY",
      ERROR: "ERROR"
    };
  }
});

// src/app/variable-chain.ts
function rgbToHex(rgb) {
  const toHex = (n01) => {
    const n255 = Math.max(0, Math.min(255, Math.round(n01 * 255)));
    const hex = n255.toString(16).padStart(2, "0");
    return hex.toUpperCase();
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
function getVariableAliasId(value) {
  if (typeof value !== "object" || value == null) return null;
  const anyValue = value;
  if (anyValue.type !== "VARIABLE_ALIAS") return null;
  if (typeof anyValue.id !== "string") return null;
  return anyValue.id;
}
function isRgb(value) {
  if (typeof value !== "object" || value == null) return false;
  const anyValue = value;
  return typeof anyValue.r === "number" && typeof anyValue.g === "number" && typeof anyValue.b === "number";
}
async function resolveChainForMode(startVariable, modeId) {
  const chain = [startVariable.name];
  const visited = /* @__PURE__ */ new Set();
  let circularDetected = false;
  let note;
  async function step(variable, currentModeId) {
    const visitKey = `${variable.id}:${currentModeId}`;
    if (visited.has(visitKey)) {
      circularDetected = true;
      return null;
    }
    visited.add(visitKey);
    const value = variable.valuesByMode[currentModeId];
    if (isRgb(value)) return value;
    const aliasId = getVariableAliasId(value);
    if (aliasId) {
      const next = await figma.variables.getVariableByIdAsync(aliasId);
      if (next == null) return null;
      chain.push(next.name);
      return await step(next, currentModeId);
    }
    const availableModeIds = Object.keys(variable.valuesByMode);
    if (availableModeIds.length === 0) return null;
    const fallbackModeId = availableModeIds[0];
    if (fallbackModeId === currentModeId) return null;
    note = note != null ? note : `No value in mode; used fallback mode "${fallbackModeId}"`;
    return await step(variable, fallbackModeId);
  }
  const resolved = await step(startVariable, modeId);
  return {
    chain,
    finalHex: resolved ? rgbToHex(resolved) : null,
    circular: circularDetected,
    note
  };
}
function extractVariableIdsFromBoundVariables(boundVariables) {
  if (typeof boundVariables !== "object" || boundVariables == null) return [];
  const ids = [];
  for (const value of Object.values(boundVariables)) {
    const aliasId = getVariableAliasId(value);
    if (aliasId) ids.push(aliasId);
  }
  return ids;
}
function extractFromPaints(paints) {
  if (!Array.isArray(paints)) return [];
  const ids = [];
  for (const paint of paints) {
    if (paint.type !== "SOLID") continue;
    const anyPaint = paint;
    ids.push(...extractVariableIdsFromBoundVariables(anyPaint.boundVariables));
  }
  return ids;
}
function idsFromNode(node) {
  const ids = [];
  const anyNode = node;
  if ("fills" in anyNode) {
    ids.push(...extractFromPaints(anyNode.fills));
  }
  if ("strokes" in anyNode) {
    ids.push(...extractFromPaints(anyNode.strokes));
  }
  if (node.type === "TEXT") {
    ids.push(...extractFromPaints(node.fills));
  }
  return ids;
}
async function collectVariablesFromNodeTree(root, onVariable) {
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.visible === false) {
      continue;
    }
    const nodeContext = {
      resolvedVariableModes: typeof node.resolvedVariableModes === "object" ? node.resolvedVariableModes : void 0
    };
    const ids = idsFromNode(node);
    for (const id of ids) {
      await onVariable(id, nodeContext);
    }
    if ("children" in node) {
      for (const child of node.children) {
        stack.push(child);
      }
    }
  }
}
async function buildVariableChainResult(found) {
  const variable = await figma.variables.getVariableByIdAsync(found.id);
  if (variable == null) return null;
  const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  if (collection == null) return null;
  const chains = [];
  for (const mode of collection.modes) {
    const resolved = await resolveChainForMode(variable, mode.modeId);
    chains.push({
      modeId: mode.modeId,
      modeName: mode.name,
      chain: resolved.chain,
      finalHex: resolved.finalHex,
      circular: resolved.circular,
      note: resolved.note
    });
  }
  return {
    variableId: variable.id,
    variableName: variable.name,
    collectionName: collection.name,
    appliedMode: found.appliedMode,
    chains
  };
}
async function getFoundVariablesFromNode(root) {
  const variableCache = /* @__PURE__ */ new Map();
  const collectionCache = /* @__PURE__ */ new Map();
  async function getVariable(id) {
    var _a;
    if (!variableCache.has(id)) {
      variableCache.set(id, await figma.variables.getVariableByIdAsync(id));
    }
    return (_a = variableCache.get(id)) != null ? _a : null;
  }
  async function getCollection(id) {
    var _a;
    if (!collectionCache.has(id)) {
      collectionCache.set(id, await figma.variables.getVariableCollectionByIdAsync(id));
    }
    return (_a = collectionCache.get(id)) != null ? _a : null;
  }
  const found = /* @__PURE__ */ new Map();
  await collectVariablesFromNodeTree(root, async (variableId, nodeContext) => {
    const variable = await getVariable(variableId);
    if (variable == null) return;
    const collection = await getCollection(variable.variableCollectionId);
    if (collection == null) return;
    const existing = found.get(variable.id);
    const entry = existing != null ? existing : { variable, collection, appliedModeIds: /* @__PURE__ */ new Set() };
    found.set(variable.id, entry);
    const resolvedModes = nodeContext.resolvedVariableModes;
    const modeId = resolvedModes == null ? void 0 : resolvedModes[collection.id];
    if (typeof modeId === "string" && modeId.length > 0) {
      entry.appliedModeIds.add(modeId);
    }
  });
  const results = [];
  for (const entry of Array.from(found.values())) {
    const modeIds = Array.from(entry.appliedModeIds);
    const modeNames = modeIds.map((id) => {
      var _a;
      return (_a = entry.collection.modes.find((m) => m.modeId === id)) == null ? void 0 : _a.name;
    }).filter((x) => typeof x === "string");
    const appliedMode = modeIds.length === 1 && modeNames.length === 1 ? { status: "single", modeId: modeIds[0], modeName: modeNames[0] } : modeIds.length > 1 ? { status: "mixed", modeIds, modeNames } : { status: "unknown" };
    results.push({
      id: entry.variable.id,
      name: entry.variable.name,
      collectionId: entry.collection.id,
      collectionName: entry.collection.name,
      appliedMode
    });
  }
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}
async function inspectSelectionForVariableChainsByLayer() {
  const selected = figma.currentPage.selection;
  if (selected.length === 0) return [];
  const results = [];
  for (const node of selected) {
    const found = await getFoundVariablesFromNode(node);
    const colors = [];
    for (const f of found) {
      const built = await buildVariableChainResult(f);
      if (built) colors.push(built);
    }
    results.push({
      layerId: node.id,
      layerName: node.name,
      layerType: node.type,
      colors
    });
  }
  return results;
}
var init_variable_chain = __esm({
  "src/app/variable-chain.ts"() {
    "use strict";
  }
});

// src/app/run.ts
function run(command) {
  showUI(
    {
      width: 520,
      height: 440,
      title: command === "chain-inspector" ? "Variable Chain Inspector" : "Figma Utilities"
    },
    { command }
  );
  let pendingTimer = null;
  const sendUpdate = async () => {
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({ type: MAIN_TO_UI.SELECTION_EMPTY });
      return;
    }
    const results = await inspectSelectionForVariableChainsByLayer();
    figma.ui.postMessage({ type: MAIN_TO_UI.VARIABLE_CHAINS_RESULT, results });
  };
  const scheduleUpdate = () => {
    if (pendingTimer != null) {
      clearTimeout(pendingTimer);
    }
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      sendUpdate().catch((e) => {
        figma.ui.postMessage({
          type: MAIN_TO_UI.ERROR,
          message: e instanceof Error ? e.message : String(e)
        });
      });
    }, 50);
  };
  figma.on("selectionchange", scheduleUpdate);
  figma.ui.onmessage = async (msg) => {
    try {
      if (msg.type === UI_TO_MAIN.BOOT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.BOOTSTRAPPED,
          command,
          selectionSize: figma.currentPage.selection.length
        });
        await sendUpdate();
        return;
      }
      if (msg.type === UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS) {
        await sendUpdate();
        return;
      }
    } catch (e) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.ERROR,
        message: e instanceof Error ? e.message : String(e)
      });
    }
  };
}
var init_run = __esm({
  "src/app/run.ts"() {
    "use strict";
    init_lib();
    init_messages();
    init_variable_chain();
  }
});

// src/home/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  run("home");
}
var init_main = __esm({
  "src/home/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/chain-inspector/main.ts
var main_exports2 = {};
__export(main_exports2, {
  default: () => main_default2
});
function main_default2() {
  run("chain-inspector");
}
var init_main2 = __esm({
  "src/chain-inspector/main.ts"() {
    "use strict";
    init_run();
  }
});

// <stdin>
var modules = { "src/home/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"], "src/chain-inspector/main.ts--default": (init_main2(), __toCommonJS(main_exports2))["default"] };
var commandId = typeof figma.command === "undefined" || figma.command === "" || figma.command === "generate" ? "src/home/main.ts--default" : figma.command;
modules[commandId]();
