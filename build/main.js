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
      SET_ACTIVE_TOOL: "SET_ACTIVE_TOOL",
      INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS",
      COLOR_CHAIN_REPLACE_MAIN_COLOR: "COLOR_CHAIN_REPLACE_MAIN_COLOR",
      COLOR_CHAIN_NOTIFY: "COLOR_CHAIN_NOTIFY",
      PRINT_COLOR_USAGES_LOAD_SETTINGS: "PRINT_COLOR_USAGES_LOAD_SETTINGS",
      PRINT_COLOR_USAGES_SAVE_SETTINGS: "PRINT_COLOR_USAGES_SAVE_SETTINGS",
      PRINT_COLOR_USAGES_PRINT: "PRINT_COLOR_USAGES_PRINT",
      PRINT_COLOR_USAGES_PREVIEW_UPDATE: "PRINT_COLOR_USAGES_PREVIEW_UPDATE",
      PRINT_COLOR_USAGES_UPDATE: "PRINT_COLOR_USAGES_UPDATE",
      PRINT_COLOR_USAGES_FOCUS_NODE: "PRINT_COLOR_USAGES_FOCUS_NODE",
      PRINT_COLOR_USAGES_RESET_LAYER_NAMES: "PRINT_COLOR_USAGES_RESET_LAYER_NAMES",
      MOCKUP_MARKUP_LOAD_STATE: "MOCKUP_MARKUP_LOAD_STATE",
      MOCKUP_MARKUP_APPLY: "MOCKUP_MARKUP_APPLY",
      MOCKUP_MARKUP_CREATE_TEXT: "MOCKUP_MARKUP_CREATE_TEXT",
      MOCKUP_MARKUP_GET_COLOR_PREVIEWS: "MOCKUP_MARKUP_GET_COLOR_PREVIEWS",
      // Variables Batch Rename
      BATCH_RENAME_EXPORT_NAME_SET: "BATCH_RENAME_EXPORT_NAME_SET",
      BATCH_RENAME_PREVIEW_IMPORT: "BATCH_RENAME_PREVIEW_IMPORT",
      BATCH_RENAME_APPLY_IMPORT: "BATCH_RENAME_APPLY_IMPORT",
      // Variables Export Import
      EXPORT_IMPORT_EXPORT_SNAPSHOT: "EXPORT_IMPORT_EXPORT_SNAPSHOT",
      EXPORT_IMPORT_PREVIEW_SNAPSHOT: "EXPORT_IMPORT_PREVIEW_SNAPSHOT",
      EXPORT_IMPORT_APPLY_SNAPSHOT: "EXPORT_IMPORT_APPLY_SNAPSHOT",
      // Variables Create Linked Colors
      LINKED_COLORS_CREATE: "LINKED_COLORS_CREATE",
      LINKED_COLORS_APPLY_EXISTING: "LINKED_COLORS_APPLY_EXISTING",
      LINKED_COLORS_RENAME: "LINKED_COLORS_RENAME",
      // Variables Replace Usages
      REPLACE_USAGES_PREVIEW: "REPLACE_USAGES_PREVIEW",
      REPLACE_USAGES_APPLY: "REPLACE_USAGES_APPLY"
    };
    MAIN_TO_UI = {
      BOOTSTRAPPED: "BOOTSTRAPPED",
      VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
      VARIABLE_CHAINS_RESULT_V2: "VARIABLE_CHAINS_RESULT_V2",
      SELECTION_EMPTY: "SELECTION_EMPTY",
      PRINT_COLOR_USAGES_SETTINGS: "PRINT_COLOR_USAGES_SETTINGS",
      PRINT_COLOR_USAGES_SELECTION: "PRINT_COLOR_USAGES_SELECTION",
      PRINT_COLOR_USAGES_STATUS: "PRINT_COLOR_USAGES_STATUS",
      PRINT_COLOR_USAGES_UPDATE_PREVIEW: "PRINT_COLOR_USAGES_UPDATE_PREVIEW",
      PRINT_COLOR_USAGES_PRINT_PREVIEW: "PRINT_COLOR_USAGES_PRINT_PREVIEW",
      MOCKUP_MARKUP_STATE: "MOCKUP_MARKUP_STATE",
      MOCKUP_MARKUP_STATUS: "MOCKUP_MARKUP_STATUS",
      MOCKUP_MARKUP_COLOR_PREVIEWS: "MOCKUP_MARKUP_COLOR_PREVIEWS",
      ERROR: "ERROR",
      // Variables Batch Rename
      BATCH_RENAME_COLLECTIONS_LIST: "BATCH_RENAME_COLLECTIONS_LIST",
      BATCH_RENAME_NAME_SET_READY: "BATCH_RENAME_NAME_SET_READY",
      BATCH_RENAME_IMPORT_PREVIEW: "BATCH_RENAME_IMPORT_PREVIEW",
      BATCH_RENAME_APPLY_PROGRESS: "BATCH_RENAME_APPLY_PROGRESS",
      BATCH_RENAME_APPLY_RESULT: "BATCH_RENAME_APPLY_RESULT",
      // Variables Export Import
      EXPORT_IMPORT_COLLECTIONS_LIST: "EXPORT_IMPORT_COLLECTIONS_LIST",
      EXPORT_IMPORT_SNAPSHOT_READY: "EXPORT_IMPORT_SNAPSHOT_READY",
      EXPORT_IMPORT_PREVIEW: "EXPORT_IMPORT_PREVIEW",
      EXPORT_IMPORT_APPLY_RESULT: "EXPORT_IMPORT_APPLY_RESULT",
      // Variables Create Linked Colors
      LINKED_COLORS_SELECTION: "LINKED_COLORS_SELECTION",
      LINKED_COLORS_CREATE_SUCCESS: "LINKED_COLORS_CREATE_SUCCESS",
      LINKED_COLORS_APPLY_SUCCESS: "LINKED_COLORS_APPLY_SUCCESS",
      LINKED_COLORS_RENAME_SUCCESS: "LINKED_COLORS_RENAME_SUCCESS",
      LINKED_COLORS_COLLECTIONS_LIST: "LINKED_COLORS_COLLECTIONS_LIST",
      // Variables Replace Usages
      REPLACE_USAGES_SELECTION: "REPLACE_USAGES_SELECTION",
      REPLACE_USAGES_PREVIEW: "REPLACE_USAGES_PREVIEW",
      REPLACE_USAGES_APPLY_PROGRESS: "REPLACE_USAGES_APPLY_PROGRESS",
      REPLACE_USAGES_APPLY_RESULT: "REPLACE_USAGES_APPLY_RESULT"
    };
  }
});

// src/app/variable-chain.ts
function toByteHex(n01) {
  const n255 = Math.max(0, Math.min(255, Math.round(n01 * 255)));
  return n255.toString(16).padStart(2, "0").toUpperCase();
}
function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}
function colorToRgbHex(color) {
  return `#${toByteHex(color.r)}${toByteHex(color.g)}${toByteHex(color.b)}`;
}
function colorToOpacityPercent(color) {
  const a = typeof color.a === "number" ? color.a : 1;
  const alpha = clamp01(a);
  return Math.round(alpha * 100);
}
function getVariableAliasId(value) {
  if (typeof value !== "object" || value == null) return null;
  const anyValue = value;
  if (anyValue.type !== "VARIABLE_ALIAS") return null;
  if (typeof anyValue.id !== "string") return null;
  return anyValue.id;
}
function isColorValue(value) {
  if (typeof value !== "object" || value == null) return false;
  const anyValue = value;
  const isRgb = typeof anyValue.r === "number" && typeof anyValue.g === "number" && typeof anyValue.b === "number";
  if (!isRgb) return false;
  if (typeof anyValue.a === "undefined") return true;
  return typeof anyValue.a === "number";
}
async function resolveChainForMode(startVariable, modeId) {
  const chain = [startVariable.name];
  const chainVariableIds = [startVariable.id];
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
    if (isColorValue(value)) return value;
    const aliasId = getVariableAliasId(value);
    if (aliasId) {
      const next = await figma.variables.getVariableByIdAsync(aliasId);
      if (next == null) return null;
      chain.push(next.name);
      chainVariableIds.push(next.id);
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
    chainVariableIds,
    finalHex: resolved ? colorToRgbHex(resolved) : null,
    finalOpacityPercent: resolved ? colorToOpacityPercent(resolved) : null,
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
async function getFoundVariablesFromRoots(roots) {
  const variableCache2 = /* @__PURE__ */ new Map();
  const collectionCache2 = /* @__PURE__ */ new Map();
  async function getVariable2(id) {
    var _a;
    if (!variableCache2.has(id)) {
      variableCache2.set(id, await figma.variables.getVariableByIdAsync(id));
    }
    return (_a = variableCache2.get(id)) != null ? _a : null;
  }
  async function getCollection2(id) {
    var _a;
    if (!collectionCache2.has(id)) {
      collectionCache2.set(id, await figma.variables.getVariableCollectionByIdAsync(id));
    }
    return (_a = collectionCache2.get(id)) != null ? _a : null;
  }
  const found = /* @__PURE__ */ new Map();
  for (const root of roots) {
    await collectVariablesFromNodeTree(root, async (variableId, nodeContext) => {
      const variable = await getVariable2(variableId);
      if (variable == null) return;
      const collection = await getCollection2(variable.variableCollectionId);
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
  }
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
  return results;
}
async function buildVariableChainResultV2(found) {
  var _a;
  const variable = await figma.variables.getVariableByIdAsync(found.id);
  if (variable == null) return null;
  const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  if (collection == null) return null;
  const hasOtherModes = collection.modes.length > 1;
  const pickedMode = found.appliedMode.status === "single" ? { modeId: found.appliedMode.modeId, modeName: found.appliedMode.modeName } : collection.modes.length > 0 ? { modeId: collection.modes[0].modeId, modeName: collection.modes[0].name } : null;
  if (pickedMode == null) {
    return {
      variableId: variable.id,
      variableName: variable.name,
      collectionName: collection.name,
      appliedMode: found.appliedMode,
      chainToRender: null,
      hasOtherModes
    };
  }
  const resolved = await resolveChainForMode(variable, pickedMode.modeId);
  const note = (_a = resolved.note) != null ? _a : found.appliedMode.status === "single" ? void 0 : `Multiple/unknown modes; showing "${pickedMode.modeName}"`;
  return {
    variableId: variable.id,
    variableName: variable.name,
    collectionName: collection.name,
    appliedMode: found.appliedMode,
    chainToRender: {
      modeId: pickedMode.modeId,
      modeName: pickedMode.modeName,
      chain: resolved.chain,
      chainVariableIds: resolved.chainVariableIds,
      finalHex: resolved.finalHex,
      finalOpacityPercent: resolved.finalOpacityPercent,
      circular: resolved.circular,
      note
    },
    hasOtherModes
  };
}
async function getFoundVariablesFromNode(root) {
  return await getFoundVariablesFromRoots([root]);
}
async function inspectSelectionForVariableChainsByLayerV2() {
  const selected = figma.currentPage.selection;
  if (selected.length === 0) return [];
  const results = [];
  for (const node of selected) {
    const found = await getFoundVariablesFromNode(node);
    const colors = [];
    for (const f of found) {
      const built = await buildVariableChainResultV2(f);
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
async function replaceVariableUsagesInSelection(sourceVariableId, targetVariableId) {
  var _a, _b;
  if (sourceVariableId === targetVariableId) {
    throw new Error("Source and target colors are the same.");
  }
  if (figma.currentPage.selection.length === 0) {
    throw new Error("Select at least one layer first.");
  }
  const sourceVariable = await figma.variables.getVariableByIdAsync(sourceVariableId);
  if (sourceVariable == null) {
    throw new Error("Source color variable was not found.");
  }
  if (sourceVariable.resolvedType !== "COLOR") {
    throw new Error("Source variable must be a COLOR variable.");
  }
  const targetVariable = await figma.variables.getVariableByIdAsync(targetVariableId);
  if (targetVariable == null) {
    throw new Error("Selected chain color variable was not found.");
  }
  if (targetVariable.resolvedType !== "COLOR") {
    throw new Error("Selected chain color must be a COLOR variable.");
  }
  const stack = [...figma.currentPage.selection];
  let nodesChanged = 0;
  let bindingsChanged = 0;
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.visible === false) continue;
    if (node.locked === true) continue;
    const anyNode = node;
    let nodeHadChanges = false;
    const boundVariables = anyNode.boundVariables;
    if (boundVariables && typeof boundVariables === "object") {
      for (const [property, binding] of Object.entries(boundVariables)) {
        if (!binding) continue;
        if (property === "fills" && Array.isArray(binding) && Array.isArray(anyNode.fills)) {
          const paints = anyNode.fills;
          const updated = paints.map((paint, index) => {
            const alias = binding[index];
            if (!(alias == null ? void 0 : alias.id) || alias.id !== sourceVariableId || paint.type !== "SOLID") return paint;
            bindingsChanged += 1;
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable);
          });
          const changed = updated.some((paint, index) => paint !== paints[index]);
          if (changed) {
            ;
            node.fills = updated;
            nodeHadChanges = true;
          }
          continue;
        }
        if (property === "strokes" && Array.isArray(binding) && Array.isArray(anyNode.strokes)) {
          const paints = anyNode.strokes;
          const updated = paints.map((paint, index) => {
            const alias = binding[index];
            if (!(alias == null ? void 0 : alias.id) || alias.id !== sourceVariableId || paint.type !== "SOLID") return paint;
            bindingsChanged += 1;
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable);
          });
          const changed = updated.some((paint, index) => paint !== paints[index]);
          if (changed) {
            ;
            node.strokes = updated;
            nodeHadChanges = true;
          }
          continue;
        }
        if (Array.isArray(binding)) continue;
        if (typeof binding !== "object" || binding == null || !("id" in binding)) continue;
        const currentId = String((_a = binding.id) != null ? _a : "");
        if (currentId !== sourceVariableId) continue;
        try {
          (_b = anyNode.setBoundVariable) == null ? void 0 : _b.call(anyNode, property, targetVariable);
          bindingsChanged += 1;
          nodeHadChanges = true;
        } catch (e) {
        }
      }
    }
    if (nodeHadChanges) nodesChanged += 1;
    if ("children" in node) {
      for (const child of node.children) stack.push(child);
    }
  }
  return {
    sourceName: sourceVariable.name,
    targetName: targetVariable.name,
    nodesChanged,
    bindingsChanged
  };
}
var init_variable_chain = __esm({
  "src/app/variable-chain.ts"() {
    "use strict";
  }
});

// src/app/tools/color-chain-tool/main-thread.ts
function registerColorChainTool(getActiveTool) {
  let pendingTimer = null;
  const sendUpdate = async () => {
    if (getActiveTool() !== "color-chain-tool") return;
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({ type: MAIN_TO_UI.SELECTION_EMPTY });
      return;
    }
    const results = await inspectSelectionForVariableChainsByLayerV2();
    figma.ui.postMessage({ type: MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2, results });
  };
  const scheduleUpdate = () => {
    if (getActiveTool() !== "color-chain-tool") return;
    if (pendingTimer != null) clearTimeout(pendingTimer);
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
  const isWithinSelection = (node) => {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) return false;
    for (const root of selection) {
      let current = node;
      while (current != null) {
        if (current.id === root.id) return true;
        current = current.parent;
      }
    }
    return false;
  };
  const isSceneNode = (node) => {
    return node != null && typeof node === "object" && "id" in node && "type" in node && "parent" in node;
  };
  const handleDocumentChange = (event) => {
    if (getActiveTool() !== "color-chain-tool") return;
    if (figma.currentPage.selection.length === 0) return;
    for (const change of event.documentChanges) {
      const node = "node" in change ? change.node : null;
      if (!isSceneNode(node)) continue;
      if (isWithinSelection(node)) {
        scheduleUpdate();
        return;
      }
    }
  };
  figma.on("selectionchange", scheduleUpdate);
  (async () => {
    try {
      await figma.loadAllPagesAsync();
      figma.on("documentchange", handleDocumentChange);
    } catch (e) {
    }
  })();
  const onMessage = async (msg) => {
    var _a;
    try {
      if (msg.type === UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS) {
        await sendUpdate();
        return true;
      }
      if (msg.type === UI_TO_MAIN.COLOR_CHAIN_REPLACE_MAIN_COLOR) {
        const { targetName } = await replaceVariableUsagesInSelection(
          msg.request.sourceVariableId,
          msg.request.targetVariableId
        );
        figma.notify(
          `Applied ${targetName}`
        );
        await sendUpdate();
        return true;
      }
      if (msg.type === UI_TO_MAIN.COLOR_CHAIN_NOTIFY) {
        const message = String((_a = msg.message) != null ? _a : "").trim();
        if (message.length > 0) {
          figma.notify(message);
        }
        return true;
      }
    } catch (e) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.ERROR,
        message: e instanceof Error ? e.message : String(e)
      });
    }
    return false;
  };
  return {
    onActivate: () => {
      scheduleUpdate();
    },
    onMessage
  };
}
var init_main_thread = __esm({
  "src/app/tools/color-chain-tool/main-thread.ts"() {
    "use strict";
    init_messages();
    init_variable_chain();
  }
});

// src/app/tools/mockup-markup/presets.ts
function getColorVariableNameCandidates(preset) {
  switch (preset) {
    case "text":
      return ["Markup Text", "Text"];
    case "text-secondary":
      return ["Markup Text Secondary", "Text Secondary", "Markup Text secondary", "Text secondary"];
    case "purple":
      return ["Markup Purple", "Purple"];
  }
}
var MOCKUP_MARKUP_LIBRARY_NAME, TEXT_STYLE_ID_BY_PRESET, COLOR_VARIABLE_ID_RAW_BY_PRESET;
var init_presets = __esm({
  "src/app/tools/mockup-markup/presets.ts"() {
    "use strict";
    MOCKUP_MARKUP_LIBRARY_NAME = "Mockup markup";
    TEXT_STYLE_ID_BY_PRESET = {
      h1: "S:3e9bacca6574fd3bb647bc3f3fec124903d58931,1190:2",
      h2: "S:d8f137455e6ade1a64398ac113cf0a49c2991ff6,1190:1",
      h3: "S:a7abb8bbbf3b902fa8801548a013157907e75bc2,1260:33",
      description: "S:d8195a8211b3819b1a888e4d1edf6218ff5d2fd5,1282:7",
      paragraph: "S:a6d1706e317719d0750eae3655a3b4360ad2b9ef,1260:39"
    };
    COLOR_VARIABLE_ID_RAW_BY_PRESET = {
      text: "VariableID:35e0b230bbdc8fa1906c60a25117319e726f2bd7/1116:1",
      "text-secondary": "VariableID:84f084bc9e1c3ed3add7febfe9326d633010f8a2/1260:12",
      purple: "VariableID:cefb32503d23428db2c20bac7615cff7b5feab07/1210:6"
    };
  }
});

// src/app/tools/mockup-markup/utils.ts
function collectTextNodesFromSelection(selection) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  function walk(node) {
    if (node.type === "TEXT" && !seen.has(node.id)) {
      seen.add(node.id);
      result.push(node);
    }
    if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }
  for (const root of selection) {
    walk(root);
  }
  return result;
}
async function loadFont(fontName) {
  try {
    await figma.loadFontAsync(fontName);
    return { ok: true, value: void 0 };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}
function logDebug(context, message, data) {
  const prefix = `[Mockup Markup] ${context}:`;
  if (data) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
}
function logWarn(context, message, data) {
  const prefix = `[Mockup Markup] ${context}:`;
  if (data) {
    console.warn(prefix, message, data);
  } else {
    console.warn(prefix, message);
  }
}
var init_utils = __esm({
  "src/app/tools/mockup-markup/utils.ts"() {
    "use strict";
  }
});

// src/app/tools/mockup-markup/resolve.ts
function extractStyleKey(styleId) {
  var _a, _b;
  const match = /^S:([^,]+)/.exec((_a = styleId == null ? void 0 : styleId.trim()) != null ? _a : "");
  return (_b = match == null ? void 0 : match[1]) != null ? _b : null;
}
async function importStyleByKey(key) {
  if (!key) return null;
  try {
    const style = await figma.importStyleByKeyAsync(key);
    if (style && style.type === "TEXT") {
      return style;
    }
  } catch (e) {
    logDebug("importStyleByKey", `Could not import style`, {
      key,
      error: e instanceof Error ? e.message : String(e)
    });
  }
  return null;
}
async function findLocalStyleByName(namePattern) {
  var _a;
  try {
    const styles = await figma.getLocalTextStylesAsync();
    return (_a = styles.find((s) => {
      var _a2;
      return namePattern.test((_a2 = s.name) != null ? _a2 : "");
    })) != null ? _a : null;
  } catch (e) {
    return null;
  }
}
function getStyleNamePattern(preset) {
  switch (preset) {
    case "h1":
      return /\bh1\b/i;
    case "h2":
      return /\bh2\b/i;
    case "h3":
      return /\bh3\b/i;
    case "description":
      return /description/i;
    case "paragraph":
      return /paragraph|body/i;
  }
}
async function resolveTextStyleIdForPreset(preset) {
  const preferredId = TEXT_STYLE_ID_BY_PRESET[preset];
  const key = extractStyleKey(preferredId);
  if (key) {
    const imported = await importStyleByKey(key);
    if (imported == null ? void 0 : imported.id) {
      logDebug("resolveTextStyleId", `Imported style for ${preset}`, { styleId: imported.id });
      return imported.id;
    }
  }
  const namePattern = getStyleNamePattern(preset);
  const byName = await findLocalStyleByName(namePattern);
  if (byName == null ? void 0 : byName.id) {
    logDebug("resolveTextStyleId", `Found local style by name for ${preset}`, {
      styleId: byName.id,
      pattern: namePattern.source
    });
    return byName.id;
  }
  logWarn("resolveTextStyleId", `Could not resolve style for ${preset}`, {
    preferredId,
    key,
    hint: "Enable the Mockup markup library in Assets \u2192 Libraries"
  });
  return null;
}
async function loadFontForTextStyle(styleId) {
  try {
    const style = await figma.getStyleByIdAsync(styleId);
    if (!style || style.type !== "TEXT") {
      return { ok: false, reason: "Style not found or not a text style" };
    }
    const fontName = style.fontName;
    if (!fontName) {
      return { ok: false, reason: "Style has no font name" };
    }
    await figma.loadFontAsync(fontName);
    return { ok: true, value: void 0 };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}
function normalizeVariableId(rawId) {
  const trimmed = (rawId != null ? rawId : "").trim();
  if (!trimmed) return "";
  const slashIdx = trimmed.indexOf("/");
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim();
}
function namesMatch(candidate, wanted) {
  const normalize = (s) => (s != null ? s : "").trim().toLowerCase();
  const c = normalize(candidate);
  const w = normalize(wanted);
  if (!c || !w) return false;
  if (c === w) return true;
  const leafIdx = c.lastIndexOf("/");
  const leaf = leafIdx >= 0 ? c.slice(leafIdx + 1) : c;
  return leaf === w;
}
async function getVariableById(variableId) {
  try {
    const v = await figma.variables.getVariableByIdAsync(variableId);
    return v != null ? v : null;
  } catch (e) {
    return null;
  }
}
async function findLocalVariableByName(nameCandidates) {
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR");
    for (const wanted of nameCandidates) {
      const match = locals.find((v) => {
        var _a;
        return namesMatch((_a = v.name) != null ? _a : "", wanted);
      });
      if (match) return match;
    }
  } catch (e) {
  }
  return null;
}
async function importVariableFromLibrary(nameCandidates) {
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const libraryName = MOCKUP_MARKUP_LIBRARY_NAME.toLowerCase();
    const preferred = collections.filter(
      (c) => {
        var _a;
        return ((_a = c.libraryName) != null ? _a : "").trim().toLowerCase() === libraryName;
      }
    );
    const rest = collections.filter(
      (c) => {
        var _a;
        return ((_a = c.libraryName) != null ? _a : "").trim().toLowerCase() !== libraryName;
      }
    );
    const ordered = [...preferred, ...rest];
    for (const collection of ordered) {
      try {
        const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
        for (const wanted of nameCandidates) {
          const match = vars.find(
            (v) => {
              var _a;
              return v.resolvedType === "COLOR" && namesMatch((_a = v.name) != null ? _a : "", wanted);
            }
          );
          if (match == null ? void 0 : match.key) {
            const imported = await figma.variables.importVariableByKeyAsync(match.key);
            if (imported) {
              logDebug("importVariableFromLibrary", `Imported variable`, {
                name: match.name,
                library: collection.libraryName
              });
              return imported;
            }
          }
        }
      } catch (e) {
      }
    }
  } catch (e) {
  }
  return null;
}
async function resolveColorVariableForPreset(preset) {
  const rawId = COLOR_VARIABLE_ID_RAW_BY_PRESET[preset];
  const normalizedId = normalizeVariableId(rawId);
  const nameCandidates = getColorVariableNameCandidates(preset);
  if (normalizedId) {
    const byId = await getVariableById(normalizedId);
    if (byId == null ? void 0 : byId.id) {
      logDebug("resolveColorVariable", `Found variable by ID for ${preset}`, { id: byId.id });
      return byId.id;
    }
  }
  const local = await findLocalVariableByName(nameCandidates);
  if (local == null ? void 0 : local.id) {
    logDebug("resolveColorVariable", `Found local variable for ${preset}`, { id: local.id });
    return local.id;
  }
  const imported = await importVariableFromLibrary(nameCandidates);
  if (imported == null ? void 0 : imported.id) {
    logDebug("resolveColorVariable", `Imported variable for ${preset}`, { id: imported.id });
    return imported.id;
  }
  logWarn("resolveColorVariable", `Could not resolve variable for ${preset}`, {
    rawId,
    nameCandidates,
    hint: "Enable the Mockup markup library in Assets \u2192 Libraries"
  });
  return null;
}
function createVariableBoundPaint(variableId) {
  const paint = {
    type: "SOLID",
    color: { r: 0, g: 0, b: 0 },
    opacity: 1
  };
  paint.boundVariables = {
    color: { type: "VARIABLE_ALIAS", id: variableId }
  };
  return paint;
}
async function setPageVariableMode(variableId, modeName) {
  var _a;
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) {
      return { ok: false, reason: "Variable not found" };
    }
    const collectionId = variable.variableCollectionId;
    if (!collectionId) {
      return { ok: false, reason: "Variable has no collection" };
    }
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
    if (!collection) {
      return { ok: false, reason: "Collection not found" };
    }
    const modes = (_a = collection.modes) != null ? _a : [];
    const targetMode = modes.find((m) => {
      var _a2;
      return ((_a2 = m.name) != null ? _a2 : "").trim().toLowerCase() === modeName;
    });
    if (targetMode == null ? void 0 : targetMode.modeId) {
      figma.currentPage.setExplicitVariableModeForCollection(collection, targetMode.modeId);
      logDebug("setPageVariableMode", `Set mode to ${modeName}`, { modeId: targetMode.modeId });
      return { ok: true, value: void 0 };
    }
    if (modeName === "light") {
      try {
        figma.currentPage.clearExplicitVariableModeForCollection(collection);
        logDebug("setPageVariableMode", "Cleared explicit mode (light fallback)");
        return { ok: true, value: void 0 };
      } catch (e) {
      }
    }
    return { ok: false, reason: `Mode "${modeName}" not found in collection` };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}
var init_resolve = __esm({
  "src/app/tools/mockup-markup/resolve.ts"() {
    "use strict";
    init_presets();
    init_utils();
  }
});

// src/app/tools/mockup-markup/apply.ts
async function applyMockupMarkupToSelection(request) {
  var _a, _b;
  const result = {
    applied: 0,
    skipped: 0,
    errors: [],
    typographyAvailable: true,
    colorAvailable: true
  };
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Select a text layer (or a frame with text) first");
    return result;
  }
  const textNodes = collectTextNodesFromSelection(selection);
  if (textNodes.length === 0) {
    figma.notify("No text layers found in selection");
    return result;
  }
  logDebug("apply", `Processing ${textNodes.length} text nodes`);
  const styleId = await resolveTextStyleIdForPreset(request.presetTypography);
  result.typographyAvailable = styleId !== null;
  if (styleId) {
    const fontResult = await loadFontForTextStyle(styleId);
    if (!fontResult.ok) {
      logWarn("apply", `Could not load font for style`, { reason: fontResult.reason });
    }
  }
  const colorVariableId = await resolveColorVariableForPreset(request.presetColor);
  result.colorAvailable = colorVariableId !== null;
  let fills = null;
  if (colorVariableId) {
    const modeResult = await setPageVariableMode(colorVariableId, request.forceModeName);
    if (!modeResult.ok) {
      logWarn("apply", `Could not set variable mode`, { reason: modeResult.reason });
    }
    fills = [createVariableBoundPaint(colorVariableId)];
  }
  const successfulNodes = [];
  for (const textNode of textNodes) {
    let nodeModified = false;
    if (styleId) {
      try {
        await textNode.setTextStyleIdAsync(styleId);
        nodeModified = true;
        logDebug("apply", `Applied style to node ${textNode.id}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!result.errors.includes(msg)) {
          result.errors.push(msg);
        }
        logWarn("apply", `Failed to apply style to node ${textNode.id}`, { error: msg });
      }
    }
    if (request.width400) {
      try {
        textNode.textAutoResize = "HEIGHT";
        textNode.resize(400, Math.max(1, textNode.height));
        nodeModified = true;
      } catch (e) {
        logDebug("apply", `Could not resize node ${textNode.id}`);
      }
    }
    if (fills) {
      try {
        textNode.fills = fills;
        const appliedFills = textNode.fills;
        if (appliedFills.length > 0 && appliedFills[0].type === "SOLID" && ((_b = (_a = appliedFills[0].boundVariables) == null ? void 0 : _a.color) == null ? void 0 : _b.id) === colorVariableId) {
          nodeModified = true;
          logDebug("apply", `Applied color to node ${textNode.id}`);
        } else {
          logWarn("apply", `Color fill not applied correctly to node ${textNode.id}`);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!result.errors.includes(msg)) {
          result.errors.push(msg);
        }
        logWarn("apply", `Failed to apply color to node ${textNode.id}`, { error: msg });
      }
    }
    if (nodeModified) {
      result.applied++;
      successfulNodes.push(textNode);
    } else {
      result.skipped++;
    }
  }
  if (successfulNodes.length > 0) {
    figma.currentPage.selection = successfulNodes;
    try {
      figma.viewport.scrollAndZoomIntoView([successfulNodes[0]]);
    } catch (e) {
    }
  }
  showResultNotification(result);
  return result;
}
function showResultNotification(result) {
  const parts = [];
  if (result.applied > 0) {
    parts.push(`Applied markup to ${result.applied} text layer(s)`);
    if (!result.typographyAvailable) {
      parts.push("(typography unavailable)");
    }
    if (result.skipped > 0) {
      parts.push(`skipped ${result.skipped}`);
    }
  } else if (result.skipped > 0) {
    parts.push(`Nothing applied (skipped ${result.skipped})`);
    if (result.errors.length > 0) {
      parts.push(result.errors[0]);
    }
  } else {
    parts.push("Nothing applied");
  }
  figma.notify(parts.join(", "));
  if (!result.typographyAvailable) {
    figma.notify(
      "Typography presets require importing Mockup markup text styles into this file (Assets \u2192 Libraries \u2192 Mockup markup)."
    );
  }
}
var init_apply = __esm({
  "src/app/tools/mockup-markup/apply.ts"() {
    "use strict";
    init_resolve();
    init_utils();
  }
});

// src/app/tools/mockup-markup/color-previews.ts
function clamp012(n) {
  return Math.max(0, Math.min(1, n));
}
function toHexByte(n01) {
  const v = Math.round(clamp012(n01) * 255);
  return v.toString(16).padStart(2, "0").toUpperCase();
}
function rgbToHex(rgb) {
  return `#${toHexByte(rgb.r)}${toHexByte(rgb.g)}${toHexByte(rgb.b)}`;
}
async function getModeIdForVariable(variableId, preferredModeName) {
  var _a, _b, _c;
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) return null;
    const collectionId = variable.variableCollectionId;
    if (!collectionId) return null;
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
    if (!collection) return null;
    const modes = (_a = collection.modes) != null ? _a : [];
    const preferredMode = modes.find(
      (m) => {
        var _a2;
        return ((_a2 = m.name) != null ? _a2 : "").trim().toLowerCase() === preferredModeName;
      }
    );
    if (preferredMode == null ? void 0 : preferredMode.modeId) {
      return preferredMode.modeId;
    }
    const explicitModes = figma.currentPage.explicitVariableModes;
    if (explicitModes == null ? void 0 : explicitModes[collectionId]) {
      return explicitModes[collectionId];
    }
    const defaultModeId = collection.defaultModeId;
    if (defaultModeId) return defaultModeId;
    return (_c = (_b = modes[0]) == null ? void 0 : _b.modeId) != null ? _c : null;
  } catch (e) {
    return null;
  }
}
async function resolveVariableColor(variableId, modeName) {
  var _a;
  const seen = /* @__PURE__ */ new Set();
  let currentId = variableId;
  for (let step = 0; step < 10; step++) {
    if (!currentId || seen.has(currentId)) break;
    seen.add(currentId);
    try {
      const variable = await figma.variables.getVariableByIdAsync(currentId);
      if (!variable) break;
      const modeId = await getModeIdForVariable(currentId, modeName);
      if (!modeId) break;
      const valuesByMode = variable.valuesByMode;
      const value = valuesByMode == null ? void 0 : valuesByMode[modeId];
      if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
        currentId = (_a = value.id) != null ? _a : null;
        continue;
      }
      if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
        const hex = rgbToHex({ r: value.r, g: value.g, b: value.b });
        const opacity = typeof value.a === "number" ? clamp012(value.a) : 1;
        const opacityPercent = Math.round(opacity * 100);
        logDebug("colorPreviews", `Resolved color`, { variableId, hex, opacityPercent });
        return { hex, opacityPercent };
      }
    } catch (e) {
      break;
    }
  }
  logDebug("colorPreviews", `Could not resolve color`, { variableId });
  return { hex: null, opacityPercent: null };
}
async function getMockupMarkupColorPreviews(forceModeName) {
  const [textId, textSecondaryId, purpleId] = await Promise.all([
    resolveColorVariableForPreset("text"),
    resolveColorVariableForPreset("text-secondary"),
    resolveColorVariableForPreset("purple")
  ]);
  const [text, textSecondary, purple] = await Promise.all([
    textId ? resolveVariableColor(textId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
    textSecondaryId ? resolveVariableColor(textSecondaryId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
    purpleId ? resolveVariableColor(purpleId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null })
  ]);
  return { text, textSecondary, purple };
}
var init_color_previews = __esm({
  "src/app/tools/mockup-markup/color-previews.ts"() {
    "use strict";
    init_resolve();
    init_utils();
  }
});

// src/app/tools/mockup-markup/create.ts
async function createMockupMarkupText(request) {
  var _a, _b;
  const result = {
    node: null,
    typographyApplied: false,
    colorApplied: false,
    errors: []
  };
  const textNode = figma.createText();
  result.node = textNode;
  const center = figma.viewport.center;
  textNode.x = center.x;
  textNode.y = center.y;
  logDebug("create", "Created text node", { x: textNode.x, y: textNode.y });
  const styleId = await resolveTextStyleIdForPreset(request.presetTypography);
  if (styleId) {
    const fontResult = await loadFontForTextStyle(styleId);
    if (fontResult.ok) {
      try {
        await textNode.setTextStyleIdAsync(styleId);
        result.typographyApplied = true;
        logDebug("create", "Applied text style", { styleId });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        result.errors.push(`Style: ${msg}`);
        logWarn("create", "Failed to apply text style", { error: msg });
      }
    } else {
      result.errors.push(`Font: ${fontResult.reason}`);
      logWarn("create", "Could not load font for style", { reason: fontResult.reason });
    }
  }
  try {
    const currentFont = textNode.fontName;
    if (currentFont && typeof currentFont === "object" && currentFont.family) {
      const fontLoadResult = await loadFont(currentFont);
      if (fontLoadResult.ok) {
        textNode.characters = "Text";
        logDebug("create", "Set text content");
      } else {
        const fallbackResult = await loadFont({ family: "Inter", style: "Regular" });
        if (fallbackResult.ok) {
          textNode.fontName = { family: "Inter", style: "Regular" };
          textNode.characters = "Text";
          logDebug("create", "Set text content with fallback font");
        } else {
          logWarn("create", "Could not load any font for text content");
        }
      }
    }
  } catch (e) {
    logWarn("create", "Error setting text content", {
      error: e instanceof Error ? e.message : String(e)
    });
  }
  if (request.width400) {
    try {
      textNode.textAutoResize = "HEIGHT";
      textNode.resize(400, Math.max(1, textNode.height));
      logDebug("create", "Applied fixed width");
    } catch (e) {
      logWarn("create", "Could not apply fixed width", {
        error: e instanceof Error ? e.message : String(e)
      });
    }
  }
  const colorVariableId = await resolveColorVariableForPreset(request.presetColor);
  if (colorVariableId) {
    const modeResult = await setPageVariableMode(colorVariableId, request.forceModeName);
    if (!modeResult.ok) {
      logWarn("create", "Could not set variable mode", { reason: modeResult.reason });
    }
    try {
      const paint = createVariableBoundPaint(colorVariableId);
      textNode.fills = [paint];
      const appliedFills = textNode.fills;
      if (appliedFills.length > 0 && appliedFills[0].type === "SOLID" && ((_b = (_a = appliedFills[0].boundVariables) == null ? void 0 : _a.color) == null ? void 0 : _b.id) === colorVariableId) {
        result.colorApplied = true;
        logDebug("create", "Applied color variable", { variableId: colorVariableId });
      } else {
        result.errors.push("Color fill not applied correctly");
        logWarn("create", "Color fill verification failed");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      result.errors.push(`Color: ${msg}`);
      logWarn("create", "Failed to apply color", { error: msg });
    }
  } else {
    logWarn("create", "Color variable not resolved", { preset: request.presetColor });
  }
  figma.currentPage.selection = [textNode];
  try {
    figma.viewport.scrollAndZoomIntoView([textNode]);
  } catch (e) {
  }
  if (!result.typographyApplied) {
    figma.notify(
      "Typography couldn't be applied. Import Mockup markup text styles into this file (Assets \u2192 Libraries \u2192 Mockup markup)."
    );
  }
  return result;
}
var init_create = __esm({
  "src/app/tools/mockup-markup/create.ts"() {
    "use strict";
    init_resolve();
    init_utils();
  }
});

// src/app/tools/mockup-markup/import-once.ts
async function getImportStatus() {
  const defaults = { text: false, "text-secondary": false, purple: false };
  try {
    const stored = await figma.clientStorage.getAsync(STORAGE_KEY);
    if (stored && typeof stored === "object") {
      return __spreadValues(__spreadValues({}, defaults), stored);
    }
  } catch (e) {
  }
  return defaults;
}
async function saveImportStatus(status) {
  try {
    await figma.clientStorage.setAsync(STORAGE_KEY, status);
  } catch (e) {
  }
}
async function importMockupMarkupVariablesOnce() {
  const status = await getImportStatus();
  const missing = ALL_PRESETS.filter((p) => !status[p]);
  if (missing.length === 0) {
    logDebug("importOnce", "All variables already imported");
    return status;
  }
  logDebug("importOnce", `Attempting to import missing variables`, { missing });
  const results = await Promise.all(
    missing.map(async (preset) => {
      const id = await resolveColorVariableForPreset(preset);
      return { preset, success: id !== null };
    })
  );
  let changed = false;
  for (const { preset, success } of results) {
    if (success) {
      status[preset] = true;
      changed = true;
      logDebug("importOnce", `Successfully imported ${preset}`);
    } else {
      logWarn("importOnce", `Failed to import ${preset}`);
    }
  }
  if (changed) {
    await saveImportStatus(status);
  }
  return status;
}
var STORAGE_KEY, ALL_PRESETS;
var init_import_once = __esm({
  "src/app/tools/mockup-markup/import-once.ts"() {
    "use strict";
    init_resolve();
    init_utils();
    STORAGE_KEY = "mockup-markup.import-status-v2";
    ALL_PRESETS = ["text", "text-secondary", "purple"];
  }
});

// src/app/tools/mockup-markup/main-thread.ts
function getState() {
  const selection = figma.currentPage.selection;
  const textNodes = selection.length > 0 ? collectTextNodesFromSelection(selection) : [];
  return {
    selectionSize: selection.length,
    textNodeCount: textNodes.length,
    hasSourceTextNode: textNodes.length > 0
  };
}
function registerMockupMarkupTool(getActiveTool) {
  const postState = () => {
    if (getActiveTool() !== "mockup-markup-tool") return;
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATE, state: getState() });
  };
  figma.on("selectionchange", postState);
  const onActivate = async () => {
    postState();
    figma.ui.postMessage({
      type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
      status: { status: "working", message: "Preparing\u2026" }
    });
    const importStatus = await importMockupMarkupVariablesOnce();
    logDebug("main", "Import status", importStatus);
    const previews = await getMockupMarkupColorPreviews("dark");
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews });
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } });
  };
  const onMessage = async (msg) => {
    try {
      switch (msg.type) {
        case UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE: {
          await onActivate();
          return true;
        }
        case UI_TO_MAIN.MOCKUP_MARKUP_APPLY: {
          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "working", message: "Applying\u2026" }
          });
          const result = await applyMockupMarkupToSelection(msg.request);
          logDebug("main", "Apply result", result);
          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "idle" }
          });
          postState();
          return true;
        }
        case UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT: {
          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "working", message: "Creating text\u2026" }
          });
          const result = await createMockupMarkupText(msg.request);
          logDebug("main", "Create result", result);
          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "idle" }
          });
          postState();
          return true;
        }
        case UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS: {
          const previews = await getMockupMarkupColorPreviews(msg.forceModeName);
          figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews });
          return true;
        }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      logWarn("main", "Error handling message", { type: msg.type, error: errorMsg });
      try {
        figma.notify(errorMsg);
      } catch (e2) {
      }
      figma.ui.postMessage({
        type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
        status: { status: "idle" }
      });
    }
    return false;
  };
  return {
    onActivate,
    onMessage
  };
}
var init_main_thread2 = __esm({
  "src/app/tools/mockup-markup/main-thread.ts"() {
    "use strict";
    init_messages();
    init_apply();
    init_color_previews();
    init_create();
    init_import_once();
    init_utils();
  }
});

// src/app/tools/print-color-usages/settings.ts
async function loadPrintColorUsagesSettings() {
  try {
    const saved = await figma.clientStorage.getAsync(
      PRINT_COLOR_USAGES_SETTINGS_KEY
    );
    return {
      textPosition: (saved == null ? void 0 : saved.textPosition) === "left" || (saved == null ? void 0 : saved.textPosition) === "right" ? saved.textPosition : "right",
      showLinkedColors: typeof (saved == null ? void 0 : saved.showLinkedColors) === "boolean" ? saved.showLinkedColors : true,
      hideFolderNames: typeof (saved == null ? void 0 : saved.hideFolderNames) === "boolean" ? saved.hideFolderNames : true,
      textTheme: (saved == null ? void 0 : saved.textTheme) === "dark" || (saved == null ? void 0 : saved.textTheme) === "light" ? saved.textTheme : "dark",
      checkByContent: typeof (saved == null ? void 0 : saved.checkByContent) === "boolean" ? saved.checkByContent : false,
      checkNested: typeof (saved == null ? void 0 : saved.checkNested) === "boolean" ? saved.checkNested : true,
      printDistance: typeof (saved == null ? void 0 : saved.printDistance) === "number" && saved.printDistance >= 0 ? saved.printDistance : 16
    };
  } catch (e) {
    return DEFAULT_PRINT_COLOR_USAGES_SETTINGS;
  }
}
async function savePrintColorUsagesSettings(settings) {
  try {
    await figma.clientStorage.setAsync(PRINT_COLOR_USAGES_SETTINGS_KEY, settings);
  } catch (e) {
  }
}
var PRINT_COLOR_USAGES_SETTINGS_KEY, DEFAULT_PRINT_COLOR_USAGES_SETTINGS;
var init_settings = __esm({
  "src/app/tools/print-color-usages/settings.ts"() {
    "use strict";
    PRINT_COLOR_USAGES_SETTINGS_KEY = "print-color-usages.ui-settings";
    DEFAULT_PRINT_COLOR_USAGES_SETTINGS = {
      textPosition: "right",
      showLinkedColors: true,
      hideFolderNames: true,
      textTheme: "dark",
      checkByContent: false,
      checkNested: true,
      printDistance: 16
    };
  }
});

// src/app/tools/print-color-usages/markup-kit.ts
function debugLog(...args) {
  if (!DEBUG_MARKUP_IDS) return;
  console.log("[Print Color Usages]", ...args);
}
function clonePaints(paints) {
  try {
    return JSON.parse(JSON.stringify(paints));
  } catch (e) {
    return Array.from(paints);
  }
}
function multiplyPaintOpacity(paints, multiplier) {
  const safe = Math.max(0, Math.min(1, multiplier));
  return clonePaints(paints).map((p) => {
    const anyPaint = p;
    const opacity = typeof anyPaint.opacity === "number" ? anyPaint.opacity : 1;
    anyPaint.opacity = opacity * safe;
    return p;
  });
}
function normalizeVariableId2(raw) {
  const trimmed = (raw != null ? raw : "").trim();
  if (!trimmed) return "";
  const slashIdx = trimmed.indexOf("/");
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim();
}
function leafName(name) {
  const idx = (name != null ? name : "").lastIndexOf("/");
  return idx >= 0 ? name.slice(idx + 1) || name : name;
}
function namesMatch2(candidate, wanted) {
  const c = (candidate != null ? candidate : "").trim().toLowerCase();
  const w = (wanted != null ? wanted : "").trim().toLowerCase();
  if (!c || !w) return false;
  return c === w || leafName(c) === w;
}
function libraryNameMatches(candidate, wanted) {
  const c = (candidate != null ? candidate : "").trim().toLowerCase();
  const w = (wanted != null ? wanted : "").trim().toLowerCase();
  if (!c || !w) return false;
  return c === w;
}
async function resolveColorVariableId(rawId, fallbackName) {
  const normalized = normalizeVariableId2(rawId);
  if (normalized) {
    try {
      const v = await figma.variables.getVariableByIdAsync(normalized);
      if (v == null ? void 0 : v.id) return { id: v.id, source: "id" };
    } catch (e) {
    }
  }
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR");
    const match = locals.find((v) => {
      var _a;
      return namesMatch2((_a = v.name) != null ? _a : "", fallbackName);
    });
    if (match == null ? void 0 : match.id) return { id: match.id, source: "local-name" };
  } catch (e) {
  }
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const preferred = collections.filter((c) => libraryNameMatches(c.libraryName, MARKUP_LIBRARY_NAME));
    const rest = collections.filter((c) => !libraryNameMatches(c.libraryName, MARKUP_LIBRARY_NAME));
    const ordered = preferred.length > 0 ? [...preferred, ...rest] : collections;
    for (const c of ordered) {
      try {
        const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key);
        const libMatch = vars.find(
          (v) => {
            var _a;
            return v.resolvedType === "COLOR" && namesMatch2((_a = v.name) != null ? _a : "", fallbackName);
          }
        );
        if (libMatch == null ? void 0 : libMatch.key) {
          const imported = await figma.variables.importVariableByKeyAsync(libMatch.key);
          if (imported == null ? void 0 : imported.id) return { id: imported.id, source: "library-import" };
        }
      } catch (e) {
      }
    }
  } catch (e) {
  }
  return null;
}
function makeSolidPaint(color, opacity = 1) {
  return { type: "SOLID", color, opacity };
}
function getThemeColors(theme) {
  const isWhite = theme === "dark";
  const primaryColor = isWhite ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 };
  const secondaryColor = isWhite ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 };
  return { primary: primaryColor, secondary: secondaryColor };
}
async function reassertPageModeForVariable(variableId) {
  var _a;
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) return;
    const collectionId = variable.variableCollectionId;
    if (!collectionId) return;
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
    if (!collection) return;
    const explicitModes = figma.currentPage.explicitVariableModes;
    const currentModeId = explicitModes == null ? void 0 : explicitModes[collectionId];
    const defaultModeId = collection.defaultModeId;
    const modeId = currentModeId || defaultModeId || Array.isArray(collection.modes) && ((_a = collection.modes[0]) == null ? void 0 : _a.modeId) || null;
    if (modeId) {
      figma.currentPage.setExplicitVariableModeForCollection(collection, modeId);
      debugLog("Reasserted page mode for variable collection", { collectionId, modeId, wasExplicit: !!currentModeId });
    }
  } catch (e) {
    debugLog("reassertPageModeForVariable failed (non-fatal)", { variableId, error: String(e) });
  }
}
function verifyFillBinding(node, expectedVariableId) {
  var _a, _b;
  try {
    const fills = node.fills;
    if (fills.length === 0) return false;
    const first = fills[0];
    if (first.type !== "SOLID") return false;
    const boundId = (_b = (_a = first.boundVariables) == null ? void 0 : _a.color) == null ? void 0 : _b.id;
    return boundId === expectedVariableId;
  } catch (e) {
    return false;
  }
}
async function resolveMarkupTextFills(themeColors) {
  const fallbackPrimary = [makeSolidPaint(themeColors.primary, 1)];
  const fallbackSecondary = [makeSolidPaint(themeColors.secondary, 0.5)];
  let primary = fallbackPrimary;
  let secondary = fallbackSecondary;
  let primaryVariableId = null;
  let secondaryVariableId = null;
  const resolvedPrimary = await resolveColorVariableId(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW, MARKUP_TEXT_VARIABLE_NAME);
  if (resolvedPrimary == null ? void 0 : resolvedPrimary.id) {
    primaryVariableId = resolvedPrimary.id;
    const paint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 };
    paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: resolvedPrimary.id } };
    primary = [paint];
    await reassertPageModeForVariable(resolvedPrimary.id);
    debugLog("Markup Text variable resolved", {
      raw: MARKUP_TEXT_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId2(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW),
      resolvedId: resolvedPrimary.id,
      source: resolvedPrimary.source,
      nameTried: MARKUP_TEXT_VARIABLE_NAME
    });
  } else {
    debugLog("Markup Text variable NOT resolved (using theme)", {
      raw: MARKUP_TEXT_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId2(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW),
      nameTried: MARKUP_TEXT_VARIABLE_NAME
    });
  }
  const resolvedSecondary = await resolveColorVariableId(
    MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
    MARKUP_TEXT_SECONDARY_VARIABLE_NAME
  );
  if (resolvedSecondary == null ? void 0 : resolvedSecondary.id) {
    secondaryVariableId = resolvedSecondary.id;
    const paint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 };
    paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: resolvedSecondary.id } };
    secondary = [paint];
    debugLog("Markup Text Secondary variable resolved", {
      raw: MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId2(MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW),
      resolvedId: resolvedSecondary.id,
      source: resolvedSecondary.source,
      nameTried: MARKUP_TEXT_SECONDARY_VARIABLE_NAME
    });
  } else {
    if (primary !== fallbackPrimary) secondary = multiplyPaintOpacity(primary, 0.5);
    debugLog("Markup Text Secondary variable NOT resolved", {
      raw: MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId2(MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW),
      nameTried: MARKUP_TEXT_SECONDARY_VARIABLE_NAME,
      usingFallback50pctOfPrimary: primary !== fallbackPrimary,
      secondarySource: primary !== fallbackPrimary ? "derived" : "theme"
    });
  }
  debugLog("Resolved label fills", {
    primarySource: primary === fallbackPrimary ? "theme" : "variable",
    secondarySource: secondary === fallbackSecondary ? "theme" : "variable_or_derived"
  });
  return { primary, secondary, primaryVariableId, secondaryVariableId };
}
async function resolveMarkupDescriptionTextStyle() {
  var _a, _b;
  const styles = await figma.getLocalTextStylesAsync();
  return (_b = (_a = styles.find((s) => s.name === "Markup Description text")) != null ? _a : styles.find((s) => /markup description text/i.test(s.name))) != null ? _b : null;
}
async function loadFontsForLabelTextStyle(markupDescriptionStyle) {
  try {
    const style = await figma.getStyleByIdAsync(MARKUP_LABEL_TEXT_STYLE_ID);
    if (style && style.type === "TEXT") {
      const fontName = style.fontName;
      if (fontName) {
        await figma.loadFontAsync(fontName);
        debugLog("Markup label textStyleId resolved & font loaded", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, fontName });
        return;
      }
    }
  } catch (e) {
    debugLog("Markup label textStyleId lookup ERROR", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) });
  }
  if (markupDescriptionStyle) {
    try {
      await figma.loadFontAsync(markupDescriptionStyle.fontName);
      debugLog("Fallback typography: local Markup Description text", { fontName: markupDescriptionStyle.fontName });
      return;
    } catch (e) {
    }
  }
  debugLog("Fallback typography: Inter Regular");
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
}
async function applyTypographyToLabel(text, markupDescriptionStyle) {
  var _a;
  try {
    await text.setTextStyleIdAsync(MARKUP_LABEL_TEXT_STYLE_ID);
    try {
      const len = ((_a = text.characters) != null ? _a : "").length;
      if (len > 0) {
        await text.setRangeTextStyleIdAsync(0, len, MARKUP_LABEL_TEXT_STYLE_ID);
      }
      debugLog("Applied label textStyleId", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, rangeLen: len });
    } catch (e) {
      debugLog("Applied label textStyleId (range apply failed)", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) });
    }
    return;
  } catch (e) {
    debugLog("Failed to apply label textStyleId (will fallback)", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) });
  }
  if (markupDescriptionStyle) {
    text.fontName = markupDescriptionStyle.fontName;
    text.fontSize = markupDescriptionStyle.fontSize;
    text.letterSpacing = markupDescriptionStyle.letterSpacing;
    text.lineHeight = markupDescriptionStyle.lineHeight;
    return;
  }
  text.fontName = { family: "Inter", style: "Regular" };
  text.fontSize = 15;
  text.lineHeight = { value: 21, unit: "PIXELS" };
}
var DEBUG_MARKUP_IDS, MARKUP_TEXT_COLOR_VARIABLE_ID_RAW, MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW, MARKUP_LIBRARY_NAME, MARKUP_TEXT_VARIABLE_NAME, MARKUP_TEXT_SECONDARY_VARIABLE_NAME, MARKUP_LABEL_TEXT_STYLE_ID;
var init_markup_kit = __esm({
  "src/app/tools/print-color-usages/markup-kit.ts"() {
    "use strict";
    DEBUG_MARKUP_IDS = false;
    MARKUP_TEXT_COLOR_VARIABLE_ID_RAW = "VariableID:35e0b230bbdc8fa1906c60a25117319e726f2bd7/1116:1";
    MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW = "VariableID:84f084bc9e1c3ed3add7febfe9326d633010f8a2/1260:12";
    MARKUP_LIBRARY_NAME = "Mockup markup";
    MARKUP_TEXT_VARIABLE_NAME = "Markup Text";
    MARKUP_TEXT_SECONDARY_VARIABLE_NAME = "Markup Text Secondary";
    MARKUP_LABEL_TEXT_STYLE_ID = "S:a6d1706e317719d0750eae3655a3b4360ad2b9ef,1260:39";
  }
});

// src/app/tools/print-color-usages/shared.ts
function maybeStripFolderPrefix(name, hideFolderNames) {
  if (!hideFolderNames) return name;
  const idx = name.lastIndexOf("/");
  if (idx === -1) return name;
  const leaf = name.slice(idx + 1);
  return leaf || name;
}
function getBoundColorVariableIdFromPaint(paint) {
  if (paint.type !== "SOLID") return null;
  const maybeBoundVariables = paint.boundVariables;
  const colorBinding = maybeBoundVariables == null ? void 0 : maybeBoundVariables.color;
  if (colorBinding && typeof colorBinding === "object" && typeof colorBinding.id === "string") {
    return colorBinding.id;
  }
  return null;
}
function stripTrailingModeSuffix(layerName) {
  return layerName.replace(/\s*\([^)]+\)\s*$/, "").trim();
}
function extractModeNameFromLayerName(layerName) {
  var _a;
  const m = layerName.match(/\(([^)]+)\)\s*$/);
  const name = ((_a = m == null ? void 0 : m[1]) != null ? _a : "").trim();
  return name ? name : null;
}
function extractVariableIdFromLayerName(layerName) {
  const trimmed = layerName.trim();
  if (!trimmed || !trimmed.startsWith("VariableID")) return null;
  const spaceIdx = trimmed.indexOf(" ");
  const parenIdx = trimmed.indexOf("(");
  const endCandidates = [spaceIdx, parenIdx].filter((i) => i > 0);
  const end = endCandidates.length > 0 ? Math.min(...endCandidates) : trimmed.length;
  const candidate = trimmed.slice(0, end).trim();
  return candidate || null;
}
async function getVariableCollectionCached(collectionId) {
  if (!collectionId) return null;
  const cached = variableCollectionCache.get(collectionId);
  if (cached) return cached;
  try {
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
    if (collection) variableCollectionCache.set(collectionId, collection);
    return collection != null ? collection : null;
  } catch (e) {
    return null;
  }
}
async function resolveVariableModeContext(variableCollectionId, node, valuesByMode, explicitModeId) {
  var _a, _b, _c, _d, _e, _f;
  const collectionId = variableCollectionId != null ? variableCollectionId : null;
  if (!collectionId) {
    return { variableCollectionId: null, modeId: null, modeName: null, isNonDefaultMode: false };
  }
  let modeId = explicitModeId != null ? explicitModeId : null;
  if (!modeId && node && "resolvedVariableModes" in node) {
    const resolvedModes = node.resolvedVariableModes;
    if (resolvedModes && typeof resolvedModes === "object" && collectionId in resolvedModes) {
      const maybe = resolvedModes[collectionId];
      if (typeof maybe === "string") modeId = maybe;
    }
  }
  if (!modeId && valuesByMode && Object.keys(valuesByMode).length > 0) {
    modeId = (_a = Object.keys(valuesByMode)[0]) != null ? _a : null;
  }
  const collection = await getVariableCollectionCached(collectionId);
  const defaultModeId = (_b = collection == null ? void 0 : collection.defaultModeId) != null ? _b : null;
  if (!modeId) {
    modeId = (_d = defaultModeId != null ? defaultModeId : Array.isArray(collection == null ? void 0 : collection.modes) ? (_c = collection.modes[0]) == null ? void 0 : _c.modeId : null) != null ? _d : null;
  }
  const modes = Array.isArray(collection == null ? void 0 : collection.modes) ? collection.modes : [];
  const modeName = modeId ? (_f = (_e = modes.find((m) => m.modeId === modeId)) == null ? void 0 : _e.name) != null ? _f : null : null;
  const isNonDefaultMode = !!(defaultModeId && modeId && modeId !== defaultModeId);
  return { variableCollectionId: collectionId, modeId, modeName, isNonDefaultMode };
}
async function resolveModeIdByName(variableCollectionId, modeName) {
  var _a, _b;
  const wanted = modeName.trim().toLowerCase();
  if (!variableCollectionId || !wanted) return null;
  const collection = await getVariableCollectionCached(variableCollectionId);
  const modes = Array.isArray(collection == null ? void 0 : collection.modes) ? collection.modes : [];
  return (_b = (_a = modes.find((m) => {
    var _a2;
    return ((_a2 = m.name) != null ? _a2 : "").trim().toLowerCase() === wanted;
  })) == null ? void 0 : _a.modeId) != null ? _b : null;
}
function isTextNode(node) {
  return node.type === "TEXT";
}
function rgbToHex2(rgb) {
  const red = Math.round(rgb.r * 255);
  const green = Math.round(rgb.g * 255);
  const blue = Math.round(rgb.b * 255);
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
}
async function resolveVariableLabelPartsFromVariable(variableId, showLinkedColors, node, hideFolderNames, explicitModeId) {
  var _a, _b, _c;
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  const primaryText = maybeStripFolderPrefix((_b = (_a = variable == null ? void 0 : variable.name) != null ? _a : variable == null ? void 0 : variable.key) != null ? _b : "Unknown Variable", hideFolderNames);
  const modeContext = await resolveVariableModeContext(
    variable == null ? void 0 : variable.variableCollectionId,
    node,
    variable == null ? void 0 : variable.valuesByMode,
    explicitModeId
  );
  if (!showLinkedColors) return { primaryText, secondaryText: "", alpha: void 0, modeContext };
  let secondaryText = "";
  let alpha = void 0;
  const currentModeId = modeContext.modeId;
  const value = currentModeId && (variable == null ? void 0 : variable.valuesByMode) ? variable.valuesByMode[currentModeId] : void 0;
  if (value && typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS") {
    const aliasValue = value;
    if (aliasValue.id) {
      try {
        const linkedVariable = await figma.variables.getVariableByIdAsync(aliasValue.id);
        if (linkedVariable == null ? void 0 : linkedVariable.name) secondaryText = maybeStripFolderPrefix(linkedVariable.name, hideFolderNames);
      } catch (e) {
      }
    }
  } else if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
    const rgb = { r: value.r, g: value.g, b: value.b };
    const rawAlpha = typeof value.a === "number" ? value.a : void 0;
    const valueOpacity = rawAlpha === void 0 ? 1 : rawAlpha;
    alpha = rawAlpha;
    try {
      const styles = await figma.getLocalPaintStylesAsync();
      for (const style of styles) {
        if (!((_c = style.paints) == null ? void 0 : _c.length)) continue;
        const stylePaint = style.paints[0];
        if (stylePaint.type !== "SOLID") continue;
        const styleOpacity = stylePaint.opacity === void 0 ? 1 : stylePaint.opacity;
        const colorMatch = Math.abs(stylePaint.color.r - rgb.r) < 1e-3 && Math.abs(stylePaint.color.g - rgb.g) < 1e-3 && Math.abs(stylePaint.color.b - rgb.b) < 1e-3 && Math.abs(styleOpacity - valueOpacity) < 1e-3;
        if (colorMatch) {
          secondaryText = maybeStripFolderPrefix(style.name, hideFolderNames);
          break;
        }
      }
    } catch (e) {
    }
    if (!secondaryText) secondaryText = rgbToHex2(rgb);
  }
  return { primaryText, secondaryText, alpha, modeContext };
}
async function findLocalVariableIdByName(name) {
  var _a, _b, _c;
  const wanted = name.trim().toLowerCase();
  if (!wanted) return null;
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const seen = /* @__PURE__ */ new Set();
    for (const collection of collections) {
      const variableIds = Array.isArray(collection.variableIds) ? collection.variableIds : [];
      for (const id of variableIds) {
        if (!id || seen.has(id)) continue;
        seen.add(id);
        try {
          const variable = await figma.variables.getVariableByIdAsync(id);
          const full = ((_a = variable == null ? void 0 : variable.name) != null ? _a : "").trim().toLowerCase();
          const leaf = maybeStripFolderPrefix((_b = variable == null ? void 0 : variable.name) != null ? _b : "", true).trim().toLowerCase();
          const key = ((_c = variable == null ? void 0 : variable.key) != null ? _c : "").trim().toLowerCase();
          if (full === wanted || leaf === wanted || key === wanted) {
            return id;
          }
        } catch (e) {
        }
      }
    }
  } catch (e) {
  }
  return null;
}
var variableCollectionCache;
var init_shared = __esm({
  "src/app/tools/print-color-usages/shared.ts"() {
    "use strict";
    variableCollectionCache = /* @__PURE__ */ new Map();
  }
});

// src/app/tools/print-color-usages/analyze.ts
async function getStyleName(node, property) {
  if (property === "fills" && "fillStyleId" in node && node.fillStyleId && typeof node.fillStyleId === "string") {
    try {
      const style = await figma.getStyleByIdAsync(node.fillStyleId);
      if (style == null ? void 0 : style.name) return style.name;
    } catch (e) {
    }
  }
  if (property === "strokes" && "strokeStyleId" in node && node.strokeStyleId && typeof node.strokeStyleId === "string") {
    try {
      const style = await figma.getStyleByIdAsync(node.strokeStyleId);
      if (style == null ? void 0 : style.name) return style.name;
    } catch (e) {
    }
  }
  return null;
}
async function getColorUsage(paint, showLinkedColors = true, node, hideFolderNames = false) {
  const boundVariableId = getBoundColorVariableIdFromPaint(paint);
  if (boundVariableId) {
    const parts = await resolveVariableLabelPartsFromVariable(boundVariableId, showLinkedColors, node, hideFolderNames);
    const primaryText = parts.primaryText;
    const secondaryText = parts.secondaryText;
    if (showLinkedColors && secondaryText && paint.type === "SOLID") {
      const separator = "   ";
      const varAlpha = parts.alpha !== void 0 ? parts.alpha : 1;
      const paintOpacity = paint.opacity !== void 0 ? paint.opacity : 1;
      const effectiveOpacity = varAlpha * paintOpacity;
      let opacitySuffix = "";
      if (Math.abs(effectiveOpacity - 1) > 1e-3) {
        opacitySuffix = ` ${Math.round(effectiveOpacity * 100)}%`;
      }
      const secondaryWithOpacity = `${secondaryText}${opacitySuffix}`;
      return {
        label: `${primaryText}${separator}${secondaryWithOpacity}`,
        layerName: boundVariableId,
        uniqueKey: boundVariableId,
        variableContext: {
          variableId: boundVariableId,
          variableCollectionId: parts.modeContext.variableCollectionId,
          variableModeId: parts.modeContext.modeId,
          variableModeName: parts.modeContext.modeName,
          isNonDefaultMode: parts.modeContext.isNonDefaultMode
        },
        styledVariableParts: {
          primaryText,
          separator,
          secondaryText: secondaryWithOpacity
        }
      };
    }
    return {
      label: primaryText,
      layerName: boundVariableId,
      uniqueKey: boundVariableId,
      variableContext: {
        variableId: boundVariableId,
        variableCollectionId: parts.modeContext.variableCollectionId,
        variableModeId: parts.modeContext.modeId,
        variableModeName: parts.modeContext.modeName,
        isNonDefaultMode: parts.modeContext.isNonDefaultMode
      }
    };
  }
  if (paint.type === "SOLID") {
    const label = rgbToHex2(paint.color) + (paint.opacity !== void 0 && paint.opacity !== 1 ? ` ${Math.round(paint.opacity * 100)}%` : "");
    return { label, layerName: label, uniqueKey: label };
  }
  return { label: "unknown color", layerName: "unknown color", uniqueKey: "unknown color" };
}
async function analyzeNodeColors(node, showLinkedColors = true, hideFolderNames = false, checkNested = true) {
  const colorInfo = [];
  if (node.visible === false) return colorInfo;
  if ("fills" in node && node.fills && Array.isArray(node.fills) && node.fills.length > 0) {
    const fillStyleName = await getStyleName(node, "fills");
    if (fillStyleName) {
      const label = maybeStripFolderPrefix(fillStyleName, hideFolderNames);
      colorInfo.push({ label, layerName: label, uniqueKey: label });
    } else {
      const fillColors = await Promise.all(
        node.fills.filter((fill) => fill.type === "SOLID" && fill.visible !== false && (fill.opacity === void 0 || fill.opacity > 0)).map((fill) => getColorUsage(fill, showLinkedColors, node, hideFolderNames))
      );
      colorInfo.push(...fillColors);
    }
  }
  if ("strokes" in node && node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const strokeStyleName = await getStyleName(node, "strokes");
    if (strokeStyleName) {
      const label = maybeStripFolderPrefix(strokeStyleName, hideFolderNames);
      colorInfo.push({ label, layerName: label, uniqueKey: label });
    } else {
      const strokeColors = await Promise.all(
        node.strokes.filter((stroke) => stroke.type === "SOLID" && stroke.visible !== false && (stroke.opacity === void 0 || stroke.opacity > 0)).map((stroke) => getColorUsage(stroke, showLinkedColors, node, hideFolderNames))
      );
      colorInfo.push(...strokeColors);
    }
  }
  if (checkNested && "children" in node) {
    const isUnion = node.type === "BOOLEAN_OPERATION" && node.booleanOperation === "UNION";
    if (!isUnion) {
      const children = node;
      for (const child of children.children) {
        const childColors = await analyzeNodeColors(child, showLinkedColors, hideFolderNames, checkNested);
        colorInfo.push(...childColors);
      }
    }
  }
  const uniqueByKey = /* @__PURE__ */ new Map();
  for (const item of colorInfo) {
    if (!uniqueByKey.has(item.uniqueKey)) uniqueByKey.set(item.uniqueKey, item);
  }
  const uniqueColors = Array.from(uniqueByKey.values());
  return uniqueColors.sort((a, b) => {
    const aIsHex = a.label.startsWith("#");
    const bIsHex = b.label.startsWith("#");
    if (aIsHex && !bIsHex) return 1;
    if (!aIsHex && bIsHex) return -1;
    return a.label.localeCompare(b.label);
  });
}
function calculateTextPositionFromRect(rect, position, index, spacing = 16) {
  const lineHeight = 24;
  const centerY = rect.y + rect.height / 2;
  const startY = centerY - 10;
  if (position === "left") {
    return { x: rect.x - spacing, y: startY + index * lineHeight };
  }
  return { x: rect.x + rect.width + spacing, y: startY + index * lineHeight };
}
var init_analyze = __esm({
  "src/app/tools/print-color-usages/analyze.ts"() {
    "use strict";
    init_shared();
  }
});

// src/app/tools/print-color-usages/print.ts
function getAbsoluteXY(node) {
  const t = node.absoluteTransform;
  return { x: t[0][2], y: t[1][2] };
}
function findContainingFrame(node) {
  let p = node.parent;
  while (p) {
    if (p.type === "FRAME") return p;
    if (p.type === "SECTION") return p;
    p = p.parent;
  }
  return null;
}
function findOutermostContainingInstance(node) {
  let current = node;
  let lastInstance = null;
  while (current) {
    if (current.type === "INSTANCE") lastInstance = current;
    current = current.parent;
  }
  return lastInstance;
}
function getNodeRectInContainer(node, container) {
  const absNode = getAbsoluteXY(node);
  if (container.type === "FRAME" || container.type === "SECTION") {
    const absContainer = getAbsoluteXY(container);
    return {
      x: absNode.x - absContainer.x,
      y: absNode.y - absContainer.y,
      width: node.width,
      height: node.height
    };
  }
  return {
    x: absNode.x,
    y: absNode.y,
    width: node.width,
    height: node.height
  };
}
async function printColorUsagesFromSelection(settings) {
  var _a, _b;
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Please select an element first");
    return 0;
  }
  await savePrintColorUsagesSettings(settings);
  const textPosition = settings.textPosition;
  const showLinkedColors = settings.showLinkedColors;
  const hideFolderNames = settings.hideFolderNames;
  const checkNested = settings.checkNested !== false;
  const printDistance = typeof settings.printDistance === "number" ? settings.printDistance : 16;
  let markupDescriptionStyle = null;
  try {
    markupDescriptionStyle = await resolveMarkupDescriptionTextStyle();
  } catch (e) {
  }
  await loadFontsForLabelTextStyle(markupDescriptionStyle);
  const themeColors = getThemeColors(settings.textTheme);
  const labelFills = await resolveMarkupTextFills(themeColors);
  const primaryFills = labelFills.primary;
  const secondaryFills = labelFills.secondary;
  const textNodes = [];
  let groupsWithNoColors = 0;
  const groups = /* @__PURE__ */ new Map();
  for (const selected of selection) {
    const anchor = (_a = findOutermostContainingInstance(selected)) != null ? _a : selected;
    const key = anchor.id;
    const existing = groups.get(key);
    if (!existing) groups.set(key, { anchor, selectedNodes: [selected] });
    else existing.selectedNodes.push(selected);
  }
  for (const group of Array.from(groups.values())) {
    const anchor = group.anchor;
    const nodesToAnalyze = group.selectedNodes.some((n) => n.id === anchor.id) ? [anchor] : group.selectedNodes;
    const merged = [];
    for (const n of nodesToAnalyze) {
      const colors = await analyzeNodeColors(n, showLinkedColors, hideFolderNames, checkNested);
      merged.push(...colors);
    }
    const uniqueByKey = /* @__PURE__ */ new Map();
    for (const item of merged) {
      if (!uniqueByKey.has(item.uniqueKey)) uniqueByKey.set(item.uniqueKey, item);
    }
    const colorInfo = Array.from(uniqueByKey.values()).sort((a, b) => {
      const aIsHex = a.label.startsWith("#");
      const bIsHex = b.label.startsWith("#");
      if (aIsHex && !bIsHex) return 1;
      if (!aIsHex && bIsHex) return -1;
      return a.label.localeCompare(b.label);
    });
    if (colorInfo.length === 0) {
      groupsWithNoColors++;
      continue;
    }
    const parentContainer = (_b = findContainingFrame(anchor)) != null ? _b : figma.currentPage;
    const nodeRect = getNodeRectInContainer(anchor, parentContainer);
    for (let i = 0; i < colorInfo.length; i++) {
      const info = colorInfo[i];
      const text = figma.createText();
      text.characters = info.label;
      await applyTypographyToLabel(text, markupDescriptionStyle);
      const ctx = info.variableContext;
      if (ctx) {
        text.name = ctx.isNonDefaultMode && ctx.variableModeName ? `${ctx.variableId} (${ctx.variableModeName})` : ctx.variableId;
      } else {
        text.name = info.layerName;
      }
      const position = calculateTextPositionFromRect(nodeRect, textPosition, i, printDistance);
      text.x = position.x;
      text.y = position.y;
      text.fills = primaryFills;
      if (labelFills.primaryVariableId && !verifyFillBinding(text, labelFills.primaryVariableId)) {
        console.warn("[Print Color Usages] Fill binding mismatch on primary fill for", text.name);
      }
      const parts = info.styledVariableParts;
      if (parts) {
        const secondaryStart = parts.primaryText.length + parts.separator.length;
        const secondaryEnd = secondaryStart + parts.secondaryText.length;
        try {
          text.setRangeFills(secondaryStart, secondaryEnd, secondaryFills);
        } catch (e) {
        }
      }
      if (textPosition === "left") text.x = nodeRect.x - text.width - 16;
      parentContainer.appendChild(text);
      textNodes.push(text);
    }
  }
  if (textNodes.length > 0) {
    figma.currentPage.selection = textNodes;
    try {
      figma.viewport.scrollAndZoomIntoView([textNodes[0]]);
    } catch (e) {
    }
    const suffix = groupsWithNoColors > 0 ? `; no colors found in ${groupsWithNoColors} selection group(s)` : "";
    figma.notify(`Created ${textNodes.length} color usage text node(s)${suffix}`);
  } else {
    figma.notify("No visible solid colors found in selection");
  }
  return textNodes.length;
}
var init_print = __esm({
  "src/app/tools/print-color-usages/print.ts"() {
    "use strict";
    init_markup_kit();
    init_analyze();
    init_settings();
  }
});

// src/app/tools/print-color-usages/update.ts
function collectTextNodesRecursivelyFromSelection(selection) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (node) => {
    if (node.type !== "TEXT") return;
    if (seen.has(node.id)) return;
    seen.add(node.id);
    result.push(node);
  };
  const walk = (node) => {
    add(node);
    if (!("children" in node)) return;
    const children = node.children;
    if (!children || !Array.isArray(children)) return;
    for (const child of children) {
      walk(child);
    }
  };
  for (const root of selection) {
    walk(root);
  }
  return result;
}
async function resolveUpdateTargetForText(text, settings) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const currentLayerName = ((_a = text.name) != null ? _a : "").trim();
  if (!currentLayerName) return null;
  let variableIdToUse = null;
  let variableCollectionId = null;
  let resolvedBy = "layer_name";
  const variableIdFromLayerName = extractVariableIdFromLayerName(currentLayerName);
  const currentTextValue = ((_b = text.characters) != null ? _b : "").trim();
  const currentTextPrimary = currentTextValue ? ((_c = currentTextValue.split(/\s{3,}/)[0]) != null ? _c : "").trim() : "";
  if (variableIdFromLayerName) {
    try {
      const v = await figma.variables.getVariableByIdAsync(variableIdFromLayerName);
      if (v == null ? void 0 : v.id) {
        variableIdToUse = v.id;
        variableCollectionId = (_d = v == null ? void 0 : v.variableCollectionId) != null ? _d : null;
        resolvedBy = "layer_variable_id";
      }
    } catch (e) {
    }
  }
  if (!variableIdToUse) {
    variableIdToUse = await findLocalVariableIdByName(stripTrailingModeSuffix(currentLayerName));
    if (variableIdToUse) {
      resolvedBy = "layer_name";
      try {
        const v = await figma.variables.getVariableByIdAsync(variableIdToUse);
        variableCollectionId = (_e = v == null ? void 0 : v.variableCollectionId) != null ? _e : null;
      } catch (e) {
      }
    }
  }
  if (!variableIdToUse && settings.checkByContent) {
    const contentCandidates = [currentTextPrimary, currentTextValue].map((s) => s.trim()).filter((s, i, arr) => s.length > 0 && arr.indexOf(s) === i);
    for (const candidate of contentCandidates) {
      const byContent = await findLocalVariableIdByName(candidate);
      if (!byContent) continue;
      variableIdToUse = byContent;
      resolvedBy = "text_content";
      try {
        const v = await figma.variables.getVariableByIdAsync(variableIdToUse);
        variableCollectionId = (_f = v == null ? void 0 : v.variableCollectionId) != null ? _f : null;
      } catch (e) {
      }
      break;
    }
  }
  if (!variableIdToUse) return null;
  let contentMismatch = void 0;
  if (settings.checkByContent && resolvedBy !== "text_content") {
    const contentCandidates = [currentTextPrimary, currentTextValue].map((s) => s.trim()).filter((s, i, arr) => s.length > 0 && arr.indexOf(s) === i);
    for (const candidate of contentCandidates) {
      const contentVarId = await findLocalVariableIdByName(candidate);
      if (contentVarId && contentVarId !== variableIdToUse) {
        try {
          const contentVar = await figma.variables.getVariableByIdAsync(contentVarId);
          const layerVar = await figma.variables.getVariableByIdAsync(variableIdToUse);
          contentMismatch = {
            contentVariableId: contentVarId,
            contentVariableName: (_g = contentVar == null ? void 0 : contentVar.name) != null ? _g : contentVarId,
            layerVariableId: variableIdToUse,
            layerVariableName: (_h = layerVar == null ? void 0 : layerVar.name) != null ? _h : variableIdToUse
          };
        } catch (e) {
        }
        break;
      }
    }
  }
  let explicitModeId = null;
  if (variableCollectionId) {
    const modeName = extractModeNameFromLayerName(currentLayerName);
    if (modeName) explicitModeId = await resolveModeIdByName(variableCollectionId, modeName);
  }
  let parts;
  try {
    parts = await resolveVariableLabelPartsFromVariable(
      variableIdToUse,
      settings.showLinkedColors,
      text,
      settings.hideFolderNames,
      explicitModeId
    );
  } catch (e) {
    return null;
  }
  const separator = "   ";
  let secondaryWithAlpha = parts.secondaryText;
  if (secondaryWithAlpha && parts.alpha !== void 0 && Math.abs(parts.alpha - 1) > 1e-3) {
    secondaryWithAlpha += ` ${Math.round(parts.alpha * 100)}%`;
  }
  const hasSecondary = settings.showLinkedColors && !!secondaryWithAlpha;
  const label = hasSecondary ? `${parts.primaryText}${separator}${secondaryWithAlpha}` : parts.primaryText;
  const desiredLayerName = parts.modeContext.isNonDefaultMode && parts.modeContext.modeName ? `${variableIdToUse} (${parts.modeContext.modeName})` : variableIdToUse;
  const needsCharactersUpdate = ((_i = text.characters) != null ? _i : "") !== label;
  const needsNameUpdate = ((_j = text.name) != null ? _j : "") !== desiredLayerName;
  const oldSecondaryText = (() => {
    var _a2;
    const raw = (_a2 = text.characters) != null ? _a2 : "";
    const rawParts = raw.split(/\s{3,}/);
    return rawParts.length > 1 ? rawParts.slice(1).join("   ").trim() : "";
  })();
  const linkedColorChanged = settings.showLinkedColors && (oldSecondaryText || "") !== (secondaryWithAlpha || "");
  const adjustedParts = __spreadProps(__spreadValues({}, parts), { secondaryText: secondaryWithAlpha });
  return {
    label,
    desiredLayerName,
    hasSecondary,
    parts: adjustedParts,
    variableIdToUse,
    needsCharactersUpdate,
    needsNameUpdate,
    linkedColorChanged,
    resolvedBy,
    contentMismatch
  };
}
async function previewUpdateSelectedTextNodesByVariableId(settings, scope = "page", onProgress) {
  var _a, _b;
  let textNodes;
  if (scope === "selection") {
    const selection = figma.currentPage.selection;
    textNodes = collectTextNodesRecursivelyFromSelection(selection);
  } else if (scope === "all_pages") {
    textNodes = [];
    for (const page of figma.root.children) {
      const nodes = page.findAll((n) => n.type === "TEXT").map((n) => n).filter((t) => {
        var _a2;
        return ((_a2 = t.name) != null ? _a2 : "").trim().startsWith("VariableID");
      });
      textNodes.push(...nodes);
    }
  } else {
    textNodes = figma.currentPage.findAll((n) => n.type === "TEXT").map((n) => n).filter((t) => {
      var _a2;
      return ((_a2 = t.name) != null ? _a2 : "").trim().startsWith("VariableID");
    });
  }
  const entries = [];
  let changed = 0;
  let unchanged = 0;
  let skipped = 0;
  const total = textNodes.length;
  for (let i = 0; i < total; i++) {
    const text = textNodes[i];
    if (onProgress && i > 0 && i % 10 === 0) {
      await onProgress(i, total);
    }
    const target = await resolveUpdateTargetForText(text, settings);
    if (!target) {
      skipped++;
      continue;
    }
    if (!target.needsCharactersUpdate && !target.needsNameUpdate) {
      unchanged++;
      continue;
    }
    changed++;
    entries.push({
      nodeId: text.id,
      nodeName: text.name || "Untitled",
      oldText: (_a = text.characters) != null ? _a : "",
      newText: target.label,
      oldLayerName: (_b = text.name) != null ? _b : "",
      newLayerName: target.desiredLayerName,
      textChanged: target.needsCharactersUpdate,
      layerNameChanged: target.needsNameUpdate,
      linkedColorChanged: target.linkedColorChanged,
      resolvedBy: target.resolvedBy,
      contentMismatch: target.contentMismatch
    });
  }
  return {
    scope,
    candidates: textNodes.length,
    changed,
    unchanged,
    skipped,
    entries
  };
}
async function updateSelectedTextNodesByVariableId(settings, options, onProgress) {
  var _a;
  await savePrintColorUsagesSettings(settings);
  const selection = figma.currentPage.selection;
  const hasSelection = selection.length > 0;
  const targetNodeIds = (_a = options == null ? void 0 : options.targetNodeIds) != null ? _a : [];
  const hasExplicitTargets = targetNodeIds.length > 0;
  let markupDescriptionStyle = null;
  try {
    markupDescriptionStyle = await resolveMarkupDescriptionTextStyle();
  } catch (e) {
  }
  await loadFontsForLabelTextStyle(markupDescriptionStyle);
  const themeColors = getThemeColors(settings.textTheme);
  const labelFills = await resolveMarkupTextFills(themeColors);
  const primaryFills = labelFills.primary;
  const secondaryFills = labelFills.secondary;
  const explicitTargetTextNodes = hasExplicitTargets ? (await Promise.all(
    targetNodeIds.map(async (id) => {
      try {
        return await figma.getNodeByIdAsync(id);
      } catch (e) {
        return null;
      }
    })
  )).filter((node) => node !== null).filter(isTextNode) : [];
  const textNodes = hasExplicitTargets ? explicitTargetTextNodes : hasSelection ? collectTextNodesRecursivelyFromSelection(selection) : figma.currentPage.findAll((n) => n.type === "TEXT").map((n) => n).filter((t) => {
    var _a2;
    return ((_a2 = t.name) != null ? _a2 : "").trim().startsWith("VariableID");
  });
  if (hasExplicitTargets && textNodes.length === 0) {
    figma.notify("No preview items selected");
    return { updated: 0, unchanged: 0, skipped: 0 };
  }
  if (!hasExplicitTargets && hasSelection && textNodes.length === 0) {
    figma.notify("No text layers selected");
    return { updated: 0, unchanged: 0, skipped: 0 };
  }
  if (!hasExplicitTargets && !hasSelection && textNodes.length === 0) {
    figma.notify('No text layers found on this page with name starting "VariableID"');
    return { updated: 0, unchanged: 0, skipped: 0 };
  }
  let updated = 0;
  let skipped = 0;
  let unchanged = 0;
  const changedNodes = [];
  const total = textNodes.length;
  for (let i = 0; i < total; i++) {
    const text = textNodes[i];
    if (onProgress && i > 0 && i % 10 === 0) {
      await onProgress(i, total);
    }
    const target = await resolveUpdateTargetForText(text, settings);
    if (!target) {
      skipped++;
      continue;
    }
    if (!target.needsCharactersUpdate && !target.needsNameUpdate) {
      unchanged++;
      continue;
    }
    try {
      if (target.needsCharactersUpdate) text.characters = target.label;
    } catch (e) {
      skipped++;
      continue;
    }
    if (target.needsNameUpdate) text.name = target.desiredLayerName;
    try {
      await applyTypographyToLabel(text, markupDescriptionStyle);
    } catch (e) {
    }
    text.fills = primaryFills;
    if (labelFills.primaryVariableId && !verifyFillBinding(text, labelFills.primaryVariableId)) {
      console.warn("[Print Color Usages] Fill binding mismatch on primary fill for", text.name);
    }
    if (target.hasSecondary) {
      const secondaryStart = target.parts.primaryText.length + 3;
      const secondaryEnd = secondaryStart + target.parts.secondaryText.length;
      try {
        text.setRangeFills(secondaryStart, secondaryEnd, Array.from(secondaryFills));
      } catch (e) {
      }
    }
    updated++;
    changedNodes.push(text);
  }
  const summaryMessage = updated > 0 ? `Updated ${updated} text layer(s)${unchanged ? `, unchanged ${unchanged}` : ""}${skipped ? `, skipped ${skipped}` : ""}${hasExplicitTargets ? " (preview selection)" : hasSelection ? "" : " (page scan)"}` : `No layers were updated${unchanged ? ` (${unchanged} unchanged)` : ""}${skipped ? `, skipped ${skipped}` : ""}${hasExplicitTargets ? " (preview selection)" : hasSelection ? "" : " (page scan)"}`;
  figma.notify(summaryMessage);
  if (changedNodes.length > 0) {
    figma.currentPage.selection = changedNodes;
    try {
      figma.viewport.scrollAndZoomIntoView([changedNodes[0]]);
    } catch (e) {
    }
  }
  return { updated, unchanged, skipped };
}
var init_update = __esm({
  "src/app/tools/print-color-usages/update.ts"() {
    "use strict";
    init_markup_kit();
    init_shared();
    init_settings();
  }
});

// src/app/tools/print-color-usages/main-thread.ts
async function postSettings() {
  const settings = await loadPrintColorUsagesSettings();
  figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS, settings: __spreadProps(__spreadValues({}, settings), { textTheme: "dark" }) });
}
function registerPrintColorUsagesTool(getActiveTool) {
  let printPreviewTimer = null;
  let cachedSettings = null;
  const postSelection = () => {
    if (getActiveTool() !== "print-color-usages-tool") return;
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION, selectionSize: figma.currentPage.selection.length });
  };
  const sendPrintPreview = async () => {
    if (getActiveTool() !== "print-color-usages-tool") return;
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW, payload: { entries: [] } });
      return;
    }
    const settings = cachedSettings != null ? cachedSettings : await loadPrintColorUsagesSettings();
    const showLinkedColors = settings.showLinkedColors;
    const hideFolderNames = settings.hideFolderNames;
    const checkNested = settings.checkNested !== false;
    const merged = [];
    for (const n of selection) {
      const colors = await analyzeNodeColors(n, showLinkedColors, hideFolderNames, checkNested);
      merged.push(...colors);
    }
    const uniqueByKey = /* @__PURE__ */ new Map();
    for (const item of merged) {
      if (!uniqueByKey.has(item.uniqueKey)) uniqueByKey.set(item.uniqueKey, item);
    }
    const colorInfo = Array.from(uniqueByKey.values()).sort((a, b) => {
      const aIsHex = a.label.startsWith("#");
      const bIsHex = b.label.startsWith("#");
      if (aIsHex && !bIsHex) return 1;
      if (!aIsHex && bIsHex) return -1;
      return a.label.localeCompare(b.label);
    });
    const entries = colorInfo.map((c) => {
      var _a, _b;
      return {
        label: c.label,
        layerName: c.variableContext ? c.variableContext.isNonDefaultMode && c.variableContext.variableModeName ? `${c.variableContext.variableId} (${c.variableContext.variableModeName})` : c.variableContext.variableId : c.layerName,
        variableId: (_a = c.variableContext) == null ? void 0 : _a.variableId,
        linkedColorName: ((_b = c.styledVariableParts) == null ? void 0 : _b.secondaryText) || void 0
      };
    });
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW, payload: { entries } });
  };
  const debouncedPrintPreview = () => {
    if (printPreviewTimer) clearTimeout(printPreviewTimer);
    printPreviewTimer = setTimeout(() => {
      sendPrintPreview();
    }, 300);
  };
  figma.on("selectionchange", () => {
    postSelection();
    debouncedPrintPreview();
  });
  const onActivate = async () => {
    postSelection();
    await postSettings();
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
    debouncedPrintPreview();
  };
  const onMessage = async (msg) => {
    var _a;
    try {
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS) {
        await onActivate();
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS) {
        const s = __spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" });
        cachedSettings = s;
        await savePrintColorUsagesSettings(s);
        debouncedPrintPreview();
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT) {
        const settings = __spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" });
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Printing\u2026" }
        });
        await yieldToUI();
        await printColorUsagesFromSelection(settings);
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_PREVIEW_UPDATE) {
        const settings = __spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" });
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Checking changes\u2026" }
        });
        await yieldToUI();
        let lastProgressTs = 0;
        const progressCallback = async (current, total) => {
          const now = Date.now();
          if (now - lastProgressTs > 200) {
            lastProgressTs = now;
            figma.ui.postMessage({
              type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
              status: { status: "working", message: `Checking\u2026 ${current}/${total} layers` }
            });
          }
          await yieldToUI();
        };
        const preview = await previewUpdateSelectedTextNodesByVariableId(settings, msg.scope, progressCallback);
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_UPDATE_PREVIEW,
          payload: {
            scope: preview.scope,
            totals: {
              candidates: preview.candidates,
              changed: preview.changed,
              unchanged: preview.unchanged,
              skipped: preview.skipped
            },
            entries: preview.entries
          }
        });
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE) {
        const settings = __spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" });
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Updating\u2026" }
        });
        await yieldToUI();
        let lastUpdateProgressTs = 0;
        const progressCallback = async (current, total) => {
          const now = Date.now();
          if (now - lastUpdateProgressTs > 200) {
            lastUpdateProgressTs = now;
            figma.ui.postMessage({
              type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
              status: { status: "working", message: `Updating\u2026 ${current}/${total} layers` }
            });
          }
          await yieldToUI();
        };
        await updateSelectedTextNodesByVariableId(settings, { targetNodeIds: msg.targetNodeIds }, progressCallback);
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_FOCUS_NODE) {
        const node = await figma.getNodeByIdAsync(msg.nodeId);
        if (!node || node.type !== "TEXT") {
          figma.notify("Layer not found");
          return true;
        }
        figma.currentPage.selection = [node];
        try {
          figma.viewport.scrollAndZoomIntoView([node]);
        } catch (e) {
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_RESET_LAYER_NAMES) {
        const nodeIds = (_a = msg.nodeIds) != null ? _a : [];
        if (nodeIds.length === 0) {
          figma.notify("No layers selected for reset");
          return true;
        }
        let resetCount = 0;
        for (const nodeId of nodeIds) {
          try {
            const node = await figma.getNodeByIdAsync(nodeId);
            if (node && node.type === "TEXT") {
              node.name = "";
              resetCount++;
            }
          } catch (e) {
          }
        }
        figma.notify(resetCount > 0 ? `Reset ${resetCount} layer name(s)` : "No layers were reset");
        return true;
      }
    } catch (e) {
      try {
        figma.notify(e instanceof Error ? e.message : String(e));
      } catch (e2) {
      }
      figma.ui.postMessage({
        type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
        status: { status: "idle" }
      });
    }
    return false;
  };
  return {
    onActivate,
    onMessage
  };
}
var yieldToUI;
var init_main_thread3 = __esm({
  "src/app/tools/print-color-usages/main-thread.ts"() {
    "use strict";
    init_messages();
    init_settings();
    init_print();
    init_update();
    init_analyze();
    yieldToUI = () => new Promise((resolve) => setTimeout(resolve, 0));
  }
});

// src/app/tools/variables-shared/caching.ts
var variableCache, collectionCache, localVariablesCache, getVariable, getCollection, getLocalVariablesForType, getAllLocalVariables, buildExistingNamesByCollection, buildLocalVariablesIndex, updateVariableInCache, clearLocalVariablesCache;
var init_caching = __esm({
  "src/app/tools/variables-shared/caching.ts"() {
    "use strict";
    variableCache = /* @__PURE__ */ new Map();
    collectionCache = /* @__PURE__ */ new Map();
    localVariablesCache = /* @__PURE__ */ new Map();
    getVariable = async (id) => {
      if (!id) return null;
      const cached = variableCache.get(id);
      if (cached) return cached;
      try {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (variable) {
          variableCache.set(id, variable);
        }
        return variable;
      } catch (e) {
        return null;
      }
    };
    getCollection = async (id) => {
      if (!id) return null;
      const cached = collectionCache.get(id);
      if (cached) return cached;
      try {
        const collection = await figma.variables.getVariableCollectionByIdAsync(id);
        if (collection) {
          collectionCache.set(id, collection);
        }
        return collection;
      } catch (e) {
        return null;
      }
    };
    getLocalVariablesForType = async (resolvedType) => {
      const cached = localVariablesCache.get(resolvedType);
      if (cached) return cached;
      const variables = await figma.variables.getLocalVariablesAsync(resolvedType);
      localVariablesCache.set(resolvedType, variables);
      return variables;
    };
    getAllLocalVariables = async (types) => {
      const variablesByType = await Promise.all(
        types.map(async (type) => getLocalVariablesForType(type))
      );
      return variablesByType.flat();
    };
    buildExistingNamesByCollection = async (scopeTypes, scopeCollectionId) => {
      var _a;
      const allVariables = await getAllLocalVariables(scopeTypes);
      const scoped = scopeCollectionId ? allVariables.filter((v) => v.variableCollectionId === scopeCollectionId) : allVariables;
      const result = /* @__PURE__ */ new Map();
      for (const variable of scoped) {
        let byName = result.get(variable.variableCollectionId);
        if (!byName) {
          byName = /* @__PURE__ */ new Map();
          result.set(variable.variableCollectionId, byName);
        }
        const bucket = (_a = byName.get(variable.name)) != null ? _a : [];
        bucket.push(variable.id);
        byName.set(variable.name, bucket);
      }
      return result;
    };
    buildLocalVariablesIndex = async () => {
      const allTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
      const allVars = await getAllLocalVariables(allTypes);
      const byId = /* @__PURE__ */ new Map();
      const byCollectionAndName = /* @__PURE__ */ new Map();
      for (const v of allVars) {
        byId.set(v.id, v);
        let byName = byCollectionAndName.get(v.variableCollectionId);
        if (!byName) {
          byName = /* @__PURE__ */ new Map();
          byCollectionAndName.set(v.variableCollectionId, byName);
        }
        if (!byName.has(v.name)) {
          byName.set(v.name, v);
        }
      }
      return { byId, byCollectionAndName };
    };
    updateVariableInCache = (variable) => {
      variableCache.set(variable.id, variable);
    };
    clearLocalVariablesCache = (resolvedType) => {
      localVariablesCache.delete(resolvedType);
    };
  }
});

// src/app/tools/variables-shared/json-parsers.ts
var isString, parseImportedRenamePlan, parseSnapshotDoc, snapshotTypeToResolvedType, flattenSnapshotVariablesTree, flattenSnapshotDoc, parseUsagesReplaceMappingJson, resolveAliasFromSnapshotValue;
var init_json_parsers = __esm({
  "src/app/tools/variables-shared/json-parsers.ts"() {
    "use strict";
    isString = (value) => typeof value === "string";
    parseImportedRenamePlan = (jsonText) => {
      var _a, _b, _c, _d, _e, _f;
      let raw;
      try {
        raw = JSON.parse(jsonText);
      } catch (e) {
        throw new Error("Invalid JSON. Please check the file contents.");
      }
      if (!raw || typeof raw !== "object") {
        throw new Error("Invalid plan: expected a JSON object.");
      }
      const obj = raw;
      if (obj.version !== 1) {
        throw new Error("Invalid plan: version must be 1.");
      }
      const entriesRaw = Array.isArray(obj.entries) ? obj.entries : Array.isArray(obj.tokens) ? obj.tokens : null;
      if (!entriesRaw) {
        throw new Error('Invalid plan: expected "entries" or "tokens" array.');
      }
      const setRaw = (_a = obj.set) != null ? _a : null;
      const titleRaw = (_c = (_b = obj.title) != null ? _b : obj.name) != null ? _c : setRaw == null ? void 0 : setRaw.name;
      const descriptionRaw = (_d = obj.description) != null ? _d : setRaw == null ? void 0 : setRaw.description;
      const createdAtRaw = (_e = obj.createdAt) != null ? _e : setRaw == null ? void 0 : setRaw.createdAt;
      const scopeRaw = (_f = obj.scope) != null ? _f : null;
      const scopeTypesRaw = scopeRaw == null ? void 0 : scopeRaw.types;
      const scopeCollectionIdRaw = scopeRaw == null ? void 0 : scopeRaw.collectionId;
      const types = Array.isArray(scopeTypesRaw) && scopeTypesRaw.length ? scopeTypesRaw.filter(isString) : ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
      const scopeCollectionId = scopeCollectionIdRaw === null || scopeCollectionIdRaw === void 0 ? null : isString(scopeCollectionIdRaw) ? scopeCollectionIdRaw : null;
      const entries = entriesRaw.map((entry) => {
        if (!entry || typeof entry !== "object") {
          return { id: "", newName: "" };
        }
        const e = entry;
        const id = isString(e.id) ? e.id.trim() : "";
        const currentName = isString(e.currentName) ? e.currentName.trim() : void 0;
        const newName = isString(e.newName) ? e.newName.trim() : isString(e.name) ? e.name.trim() : currentName ? currentName : "";
        const expectedOldName = isString(e.expectedOldName) ? e.expectedOldName.trim() : currentName;
        return { id, expectedOldName, newName };
      });
      const plan = {
        version: 1,
        title: isString(titleRaw) ? titleRaw : void 0,
        createdAt: isString(createdAtRaw) ? createdAtRaw : void 0,
        scope: { collectionId: scopeCollectionId, types },
        entries
      };
      const meta = {
        version: 1,
        title: plan.title,
        description: isString(descriptionRaw) ? descriptionRaw : void 0,
        createdAt: plan.createdAt,
        scope: { collectionId: scopeCollectionId, types }
      };
      return { plan, meta };
    };
    parseSnapshotDoc = (jsonText) => {
      let raw;
      try {
        raw = JSON.parse(jsonText);
      } catch (e) {
        throw new Error("Invalid JSON. Please check the file contents.");
      }
      if (!raw || typeof raw !== "object") {
        throw new Error("Invalid snapshot: expected a JSON object.");
      }
      const obj = raw;
      const collectionsRaw = obj.collections;
      if (!Array.isArray(collectionsRaw)) {
        throw new Error('Invalid snapshot: expected "collections" array.');
      }
      return { collections: collectionsRaw };
    };
    snapshotTypeToResolvedType = (type) => {
      const t = String(type || "").toLowerCase();
      if (t === "color") return "COLOR";
      if (t === "number") return "FLOAT";
      if (t === "string") return "STRING";
      if (t === "boolean") return "BOOLEAN";
      return null;
    };
    flattenSnapshotVariablesTree = (collectionName, node, prefix, out) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) {
        return;
      }
      const obj = node;
      if ("type" in obj && "values" in obj && obj.values && typeof obj.values === "object" && !Array.isArray(obj.values)) {
        const resolvedType = snapshotTypeToResolvedType(obj.type);
        const values = obj.values;
        const name = prefix.join("/").trim();
        if (!name || !resolvedType) {
          return;
        }
        const id = isString(obj.id) ? obj.id.trim() : void 0;
        const description = isString(obj.description) ? obj.description : void 0;
        const scopes = Array.isArray(obj.scopes) ? obj.scopes.filter(isString) : void 0;
        out.push({ collectionName, variableName: name, id, resolvedType, values, description, scopes });
        return;
      }
      for (const [key, child] of Object.entries(obj)) {
        const nextKey = String(key || "").trim();
        if (!nextKey) continue;
        flattenSnapshotVariablesTree(collectionName, child, [...prefix, nextKey], out);
      }
    };
    flattenSnapshotDoc = (doc) => {
      var _a;
      const entries = [];
      for (const c of (_a = doc.collections) != null ? _a : []) {
        const name = String(c.name || "").trim();
        const vars = c.variables;
        if (!name || !vars) continue;
        flattenSnapshotVariablesTree(name, vars, [], entries);
      }
      return entries;
    };
    parseUsagesReplaceMappingJson = (jsonText) => {
      let raw;
      try {
        raw = JSON.parse(jsonText);
      } catch (e) {
        throw new Error("Invalid JSON. Please check the file contents.");
      }
      if (!raw || typeof raw !== "object") {
        throw new Error("Invalid mapping: expected a JSON object.");
      }
      const obj = raw;
      if (obj.version !== 1) {
        throw new Error("Invalid mapping: version must be 1.");
      }
      const replacementsRaw = obj.replacements;
      if (!Array.isArray(replacementsRaw)) {
        throw new Error('Invalid mapping: expected "replacements" array.');
      }
      const collectionName = isString(obj.collectionName) ? obj.collectionName.trim() : void 0;
      const collectionId = isString(obj.collectionId) ? obj.collectionId.trim() : void 0;
      const replacements = replacementsRaw.map((r) => {
        if (!r || typeof r !== "object") return { from: "", to: "" };
        const row = r;
        return {
          from: isString(row.from) ? row.from.trim() : "",
          to: isString(row.to) ? row.to.trim() : ""
        };
      });
      return { version: 1, collectionName, collectionId, replacements };
    };
    resolveAliasFromSnapshotValue = async (raw, byCollectionName, byCollectionAndName) => {
      var _a;
      const aliasString = (() => {
        if (raw && typeof raw === "object" && !Array.isArray(raw) && isString(raw.$alias)) {
          return String(raw.$alias).trim();
        }
        return null;
      })();
      if (!aliasString) return null;
      const idx = aliasString.indexOf(":");
      if (idx <= 0) return null;
      const collectionName = aliasString.slice(0, idx).trim();
      const variableName = aliasString.slice(idx + 1).trim();
      if (!collectionName || !variableName) return null;
      const col = byCollectionName.get(collectionName);
      if (!col) return null;
      const target = (_a = byCollectionAndName.get(col.id)) == null ? void 0 : _a.get(variableName);
      if (!target) return null;
      return { type: "VARIABLE_ALIAS", id: target.id };
    };
  }
});

// src/app/tools/variables-batch-rename/main-thread.ts
function registerVariablesBatchRenameTool(getActiveTool) {
  const sendCollectionsList = async () => {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const collectionsInfo = await Promise.all(
      collections.map(async (c) => {
        var _a;
        const collection = await figma.variables.getVariableCollectionByIdAsync(c.id);
        return {
          id: c.id,
          name: c.name,
          modeCount: c.modes.length,
          variableCount: (_a = collection == null ? void 0 : collection.variableIds.length) != null ? _a : 0
        };
      })
    );
    figma.ui.postMessage({
      type: MAIN_TO_UI.BATCH_RENAME_COLLECTIONS_LIST,
      collections: collectionsInfo
    });
  };
  const exportNameSet = async (setName, description, collectionId, collectionIds, types, includeCurrentName) => {
    var _a, _b, _c;
    const trimmedName = setName.trim();
    if (!trimmedName) {
      throw new Error("Set name is required.");
    }
    const resolvedTypes = types.length > 0 ? types : ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
    const resolvedCollectionIds = Array.isArray(collectionIds) ? collectionIds.filter(isString).map((id) => id.trim()).filter(Boolean) : [];
    const allVariables = await getAllLocalVariables(resolvedTypes);
    const scoped = resolvedCollectionIds.length ? allVariables.filter((v) => resolvedCollectionIds.includes(v.variableCollectionId)) : collectionId ? allVariables.filter((v) => v.variableCollectionId === collectionId) : allVariables;
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    const scopedByCollectionId = /* @__PURE__ */ new Map();
    for (const variable of scoped) {
      const bucket = (_a = scopedByCollectionId.get(variable.variableCollectionId)) != null ? _a : [];
      bucket.push(variable);
      scopedByCollectionId.set(variable.variableCollectionId, bucket);
    }
    const orderedScoped = [];
    for (const collection of localCollections) {
      const variablesInCollection = (_b = scopedByCollectionId.get(collection.id)) != null ? _b : [];
      if (!variablesInCollection.length) continue;
      const byId = new Map(variablesInCollection.map((variable) => [variable.id, variable]));
      const collectionDetails = await figma.variables.getVariableCollectionByIdAsync(collection.id);
      const orderedByCollectionIds = ((_c = collectionDetails == null ? void 0 : collectionDetails.variableIds) != null ? _c : []).map((id) => byId.get(id)).filter((variable) => variable != null);
      const orderedIdSet = new Set(orderedByCollectionIds.map((variable) => variable.id));
      orderedScoped.push(
        ...orderedByCollectionIds,
        ...variablesInCollection.filter((variable) => !orderedIdSet.has(variable.id))
      );
    }
    const setObject = {
      version: 1,
      name: trimmedName,
      description: (description == null ? void 0 : description.trim()) || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      scope: {
        collectionId: resolvedCollectionIds.length ? null : collectionId,
        collectionIds: resolvedCollectionIds.length ? resolvedCollectionIds : void 0
      },
      tokens: orderedScoped.map(
        (v) => includeCurrentName ? { currentName: v.name, newName: v.name, id: v.id } : { newName: v.name, id: v.id }
      )
    };
    const safeName = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
    return {
      filename: `${safeName || "name-set"}-${setObject.createdAt}.json`,
      jsonText: JSON.stringify(setObject, null, 2)
    };
  };
  const buildImportedRenamePreview = async (jsonText) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const { plan, meta } = parseImportedRenamePlan(jsonText);
    const scopeCollectionId = (_b = (_a = plan.scope) == null ? void 0 : _a.collectionId) != null ? _b : null;
    const scopeTypes = ((_d = (_c = plan.scope) == null ? void 0 : _c.types) == null ? void 0 : _d.length) ? plan.scope.types : ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
    const existingNamesByCollection = await buildExistingNamesByCollection(scopeTypes, scopeCollectionId);
    const previewEntries = [];
    const variables = await Promise.all(
      plan.entries.map(async (entry) => entry.id ? getVariable(entry.id) : null)
    );
    const plannedByCollection = /* @__PURE__ */ new Map();
    plan.entries.forEach((entry, index) => {
      var _a2;
      const variable = variables[index];
      if (!variable || !entry.id || !entry.newName) return;
      const colId = variable.variableCollectionId;
      let byName = plannedByCollection.get(colId);
      if (!byName) {
        byName = /* @__PURE__ */ new Map();
        plannedByCollection.set(colId, byName);
      }
      const bucket = (_a2 = byName.get(entry.newName)) != null ? _a2 : [];
      bucket.push(variable.id);
      byName.set(entry.newName, bucket);
    });
    let renames = 0;
    let unchanged = 0;
    let conflicts = 0;
    let missing = 0;
    let stale = 0;
    let invalid = 0;
    let outOfScope = 0;
    for (let i = 0; i < plan.entries.length; i += 1) {
      const entry = plan.entries[i];
      const variable = variables[i];
      if (!entry.id || !entry.newName) {
        invalid += 1;
        previewEntries.push({
          variableId: entry.id || `row-${i + 1}`,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "invalid",
          reason: "Missing id or newName."
        });
        continue;
      }
      if (!variable) {
        missing += 1;
        previewEntries.push({
          variableId: entry.id,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "missing",
          reason: "Variable not found (maybe deleted or not local)."
        });
        continue;
      }
      const collection = await getCollection(variable.variableCollectionId);
      const currentName = variable.name;
      if (scopeCollectionId && variable.variableCollectionId !== scopeCollectionId) {
        outOfScope += 1;
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: (_e = collection == null ? void 0 : collection.name) != null ? _e : "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "out_of_scope",
          reason: "Variable is outside of plan scope collection."
        });
        continue;
      }
      if (scopeTypes.length && !scopeTypes.includes(variable.resolvedType)) {
        outOfScope += 1;
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: (_f = collection == null ? void 0 : collection.name) != null ? _f : "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "out_of_scope",
          reason: "Variable type not in plan scope."
        });
        continue;
      }
      const nameMismatchWarning = entry.expectedOldName && entry.expectedOldName !== currentName ? `Expected "${entry.expectedOldName}" but variable is currently "${currentName}".` : void 0;
      if (entry.expectedOldName && entry.expectedOldName !== currentName) {
        stale += 1;
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: (_g = collection == null ? void 0 : collection.name) != null ? _g : "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "stale",
          reason: "Variable name changed since plan was created.",
          warning: nameMismatchWarning
        });
        continue;
      }
      if (currentName === entry.newName) {
        unchanged += 1;
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: (_h = collection == null ? void 0 : collection.name) != null ? _h : "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "unchanged",
          warning: nameMismatchWarning
        });
        continue;
      }
      const byExisting = (_i = existingNamesByCollection.get(variable.variableCollectionId)) != null ? _i : /* @__PURE__ */ new Map();
      const existingIds = (_j = byExisting.get(entry.newName)) != null ? _j : [];
      const byPlanned = (_k = plannedByCollection.get(variable.variableCollectionId)) != null ? _k : /* @__PURE__ */ new Map();
      const plannedIds = (_l = byPlanned.get(entry.newName)) != null ? _l : [];
      const existingConflict = existingIds.some((id) => id !== variable.id);
      const plannedConflict = plannedIds.length > 1;
      if (existingConflict || plannedConflict) {
        conflicts += 1;
        const conflicting = [
          ...existingIds.filter((id) => id !== variable.id),
          ...plannedIds.filter((id) => id !== variable.id)
        ].map((id) => ({ variableId: id, name: entry.newName }));
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: (_m = collection == null ? void 0 : collection.name) != null ? _m : "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "conflict",
          reason: "Name already exists or multiple plan entries map to the same newName.",
          conflictWith: conflicting,
          warning: nameMismatchWarning
        });
        continue;
      }
      renames += 1;
      previewEntries.push({
        variableId: variable.id,
        collectionId: variable.variableCollectionId,
        collectionName: (_n = collection == null ? void 0 : collection.name) != null ? _n : "Unknown collection",
        resolvedType: variable.resolvedType,
        currentName,
        expectedOldName: entry.expectedOldName,
        newName: entry.newName,
        status: "rename",
        warning: nameMismatchWarning
      });
    }
    return {
      meta,
      totals: {
        considered: plan.entries.length,
        renames,
        unchanged,
        conflicts,
        missing,
        stale,
        invalid,
        outOfScope
      },
      entries: previewEntries
    };
  };
  const applyImportedRenamePlan = async (entries, onProgress) => {
    var _a, _b, _c, _d;
    const results = [];
    let renamed = 0;
    let unchanged = 0;
    let skipped = 0;
    let failed = 0;
    const allTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
    const existingNamesByCollection = await buildExistingNamesByCollection(allTypes, null);
    const total = entries.length;
    let done = 0;
    if (onProgress) {
      onProgress(0, total);
    }
    for (const entry of entries) {
      const variable = await getVariable(entry.variableId);
      if (!variable) {
        skipped += 1;
        results.push({ variableId: entry.variableId, status: "skipped", reason: "Variable not found." });
        done += 1;
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total);
        }
        continue;
      }
      const beforeName = variable.name;
      const newName = entry.newName.trim();
      if (!newName) {
        failed += 1;
        results.push({
          variableId: variable.id,
          beforeName,
          status: "failed",
          reason: "New name is empty."
        });
        done += 1;
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total);
        }
        continue;
      }
      if (beforeName === newName) {
        unchanged += 1;
        results.push({ variableId: variable.id, beforeName, afterName: newName, status: "unchanged" });
        done += 1;
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total);
        }
        continue;
      }
      const byName = (_a = existingNamesByCollection.get(variable.variableCollectionId)) != null ? _a : /* @__PURE__ */ new Map();
      const existingIds = (_b = byName.get(newName)) != null ? _b : [];
      const hasConflict = existingIds.some((id) => id !== variable.id);
      if (hasConflict) {
        skipped += 1;
        results.push({
          variableId: variable.id,
          beforeName,
          afterName: newName,
          status: "skipped",
          reason: "Target name already exists in this collection."
        });
        done += 1;
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total);
        }
        continue;
      }
      try {
        const oldBucket = (_c = byName.get(beforeName)) != null ? _c : [];
        byName.set(
          beforeName,
          oldBucket.filter((id) => id !== variable.id)
        );
        const newBucket = (_d = byName.get(newName)) != null ? _d : [];
        newBucket.push(variable.id);
        byName.set(newName, newBucket);
        existingNamesByCollection.set(variable.variableCollectionId, byName);
        variable.name = newName;
        updateVariableInCache(variable);
        clearLocalVariablesCache(variable.resolvedType);
        renamed += 1;
        results.push({ variableId: variable.id, beforeName, afterName: newName, status: "renamed" });
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "Rename failed.";
        results.push({
          variableId: variable.id,
          beforeName,
          afterName: newName,
          status: "failed",
          reason: message
        });
      }
      done += 1;
      if (onProgress && (done % 20 === 0 || done === total)) {
        onProgress(done, total);
      }
    }
    return { totals: { renamed, unchanged, skipped, failed }, results };
  };
  return {
    async onActivate() {
      await sendCollectionsList();
    },
    async onMessage(msg) {
      if (getActiveTool() !== "variables-batch-rename-tool") return false;
      if (msg.type === UI_TO_MAIN.BATCH_RENAME_EXPORT_NAME_SET) {
        try {
          const { setName, description, collectionId, collectionIds, types, includeCurrentName } = msg.request;
          const payload = await exportNameSet(
            setName,
            description,
            collectionId != null ? collectionId : null,
            collectionIds != null ? collectionIds : null,
            types != null ? types : [],
            includeCurrentName !== false
          );
          figma.ui.postMessage({
            type: MAIN_TO_UI.BATCH_RENAME_NAME_SET_READY,
            payload
          });
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Export failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Export failed"
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT) {
        try {
          const payload = await buildImportedRenamePreview(msg.request.jsonText);
          figma.ui.postMessage({
            type: MAIN_TO_UI.BATCH_RENAME_IMPORT_PREVIEW,
            payload
          });
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Preview failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Preview failed"
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.BATCH_RENAME_APPLY_IMPORT) {
        try {
          const payload = await applyImportedRenamePlan(msg.request.entries, (done, total) => {
            figma.ui.postMessage({
              type: MAIN_TO_UI.BATCH_RENAME_APPLY_PROGRESS,
              progress: {
                current: done,
                total,
                message: `Renaming variables... ${done}/${total}`
              }
            });
          });
          figma.ui.postMessage({
            type: MAIN_TO_UI.BATCH_RENAME_APPLY_RESULT,
            payload
          });
          const { renamed, failed, skipped } = payload.totals;
          if (failed === 0 && skipped === 0) {
            figma.notify(`Renamed ${renamed} variables`);
          } else {
            figma.notify(
              `Renamed ${renamed} variables, ${skipped} skipped, ${failed} failed`
            );
          }
          await sendCollectionsList();
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Apply failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Apply failed"
          });
        }
        return true;
      }
      return false;
    }
  };
}
var init_main_thread4 = __esm({
  "src/app/tools/variables-batch-rename/main-thread.ts"() {
    "use strict";
    init_messages();
    init_caching();
    init_json_parsers();
  }
});

// src/app/tools/variables-export-import/main-thread.ts
function registerVariablesExportImportTool(getActiveTool) {
  const sendCollectionsList = async () => {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const collectionsInfo = await Promise.all(
      collections.map(async (c) => {
        var _a;
        const collection = await figma.variables.getVariableCollectionByIdAsync(c.id);
        return {
          id: c.id,
          name: c.name,
          modeCount: c.modes.length,
          variableCount: (_a = collection == null ? void 0 : collection.variableIds.length) != null ? _a : 0
        };
      })
    );
    figma.ui.postMessage({
      type: MAIN_TO_UI.EXPORT_IMPORT_COLLECTIONS_LIST,
      collections: collectionsInfo
    });
  };
  const exportVariablesSnapshot = async (collectionIds) => {
    var _a, _b, _c;
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const wantedIds = Array.isArray(collectionIds) && collectionIds.length ? collectionIds.filter(isString).map((id) => id.trim()).filter(Boolean) : [];
    const scopedCollections = wantedIds.length ? collections.filter((c) => wantedIds.includes(c.id)) : collections;
    const allTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"];
    const allVars = await getAllLocalVariables(allTypes);
    const files = [];
    const nameCounts = /* @__PURE__ */ new Map();
    for (const collection of scopedCollections) {
      const variablesInCollection = allVars.filter((v) => v.variableCollectionId === collection.id);
      const variablesById = new Map(variablesInCollection.map((variable) => [variable.id, variable]));
      const collectionDetails = await figma.variables.getVariableCollectionByIdAsync(collection.id);
      const orderedByCollectionIds = ((_a = collectionDetails == null ? void 0 : collectionDetails.variableIds) != null ? _a : []).map((id) => variablesById.get(id)).filter((variable) => variable != null);
      const orderedIdSet = new Set(orderedByCollectionIds.map((variable) => variable.id));
      const variables = [
        ...orderedByCollectionIds,
        ...variablesInCollection.filter((variable) => !orderedIdSet.has(variable.id))
      ];
      const variablesTree = {};
      for (const variable of variables) {
        const parts = variable.name.split("/").map((p) => p.trim());
        const cleanParts = parts.filter(Boolean);
        if (!cleanParts.length) continue;
        const leafKey = cleanParts[cleanParts.length - 1];
        const groupPath = cleanParts.slice(0, -1);
        const type = variable.resolvedType === "COLOR" ? "color" : variable.resolvedType === "FLOAT" ? "number" : variable.resolvedType === "STRING" ? "string" : variable.resolvedType === "BOOLEAN" ? "boolean" : "unknown";
        const values = {};
        for (const mode of collection.modes) {
          const modeName = mode.name;
          const rawValue = (_b = variable.valuesByMode) == null ? void 0 : _b[mode.modeId];
          if (rawValue === null || rawValue === void 0) {
            values[modeName] = "";
            continue;
          }
          if (typeof rawValue === "object" && rawValue && rawValue.type === "VARIABLE_ALIAS" && isString(rawValue.id)) {
            values[modeName] = await formatAliasRef(
              String(rawValue.id)
            );
            continue;
          }
          if (variable.resolvedType === "COLOR" && typeof rawValue === "object" && rawValue) {
            const v = rawValue;
            if (typeof v.r === "number" && typeof v.g === "number" && typeof v.b === "number") {
              values[modeName] = rgbaToHex({
                r: v.r,
                g: v.g,
                b: v.b,
                a: typeof v.a === "number" ? v.a : 1
              });
              continue;
            }
          }
          values[modeName] = rawValue;
        }
        const description = typeof variable.description === "string" && variable.description.trim() ? String(variable.description) : void 0;
        const scopesRaw = Array.isArray(variable.scopes) ? variable.scopes : [];
        const scopes = scopesRaw.filter(isString);
        const entry = {
          id: variable.id,
          type,
          values,
          description,
          scopes: scopes.length ? scopes : void 0
        };
        const path = [...groupPath, leafKey];
        setNestedObject(variablesTree, path, entry);
      }
      const doc = {
        collections: [
          {
            name: collection.name,
            modes: collection.modes.map((m) => m.name),
            variables: variablesTree
          }
        ]
      };
      const baseFilename = `${collection.name}.json`;
      const prev = (_c = nameCounts.get(baseFilename)) != null ? _c : 0;
      nameCounts.set(baseFilename, prev + 1);
      const filename = prev === 0 ? baseFilename : `${collection.name}-${prev + 1}.json`;
      files.push({ filename, jsonText: JSON.stringify(doc, null, 4) });
    }
    return { files };
  };
  const buildVariablesSnapshotImportPreview = async (jsonText) => {
    var _a, _b, _c, _d;
    const doc = parseSnapshotDoc(jsonText);
    const flat = flattenSnapshotDoc(doc);
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    const byCollectionName = new Map(localCollections.map((c) => [c.name, c]));
    const { byId, byCollectionAndName } = await buildLocalVariablesIndex();
    const plannedNamesByCollection = /* @__PURE__ */ new Map();
    const entries = [];
    let create = 0;
    let update = 0;
    let rename = 0;
    let conflicts = 0;
    let missingCollections = 0;
    let invalid = 0;
    for (const row of flat) {
      const collection = byCollectionName.get(row.collectionName);
      if (!collection) {
        missingCollections += 1;
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "missing_collection",
          reason: "Collection not found in this Figma file."
        });
        continue;
      }
      if (!row.variableName || !row.resolvedType) {
        invalid += 1;
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName || "(missing)",
          status: "invalid"
        });
        continue;
      }
      const set = (_a = plannedNamesByCollection.get(collection.id)) != null ? _a : /* @__PURE__ */ new Set();
      if (set.has(row.variableName)) {
        conflicts += 1;
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "conflict",
          reason: "Duplicate variable name in snapshot for this collection."
        });
        continue;
      }
      set.add(row.variableName);
      plannedNamesByCollection.set(collection.id, set);
      const existingByName = (_c = (_b = byCollectionAndName.get(collection.id)) == null ? void 0 : _b.get(row.variableName)) != null ? _c : null;
      const existingById = row.id ? (_d = byId.get(row.id)) != null ? _d : null : null;
      const target = existingById != null ? existingById : existingByName;
      if (target) {
        if (target.variableCollectionId !== collection.id) {
          conflicts += 1;
          entries.push({
            collectionName: row.collectionName,
            variableName: row.variableName,
            status: "conflict",
            reason: "Snapshot variable id refers to a variable in a different collection."
          });
          continue;
        }
        if (target.resolvedType !== row.resolvedType) {
          conflicts += 1;
          entries.push({
            collectionName: row.collectionName,
            variableName: row.variableName,
            status: "conflict",
            reason: "Type mismatch between snapshot and existing variable."
          });
          continue;
        }
        if (existingById && target.name !== row.variableName) {
          rename += 1;
          entries.push({
            collectionName: row.collectionName,
            variableName: row.variableName,
            status: "rename"
          });
          continue;
        }
        update += 1;
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "update"
        });
        continue;
      }
      create += 1;
      entries.push({
        collectionName: row.collectionName,
        variableName: row.variableName,
        status: "create"
      });
    }
    return {
      totals: {
        considered: flat.length,
        create,
        update,
        rename,
        conflicts,
        missingCollections,
        invalid
      },
      entries
    };
  };
  const applyVariablesSnapshotImport = async (jsonText) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const doc = parseSnapshotDoc(jsonText);
    const flat = flattenSnapshotDoc(doc);
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    const byCollectionName = new Map(localCollections.map((c) => [c.name, c]));
    const { byId, byCollectionAndName } = await buildLocalVariablesIndex();
    const results = [];
    let created = 0;
    let updated = 0;
    let renamed = 0;
    let skipped = 0;
    let failed = 0;
    for (const row of flat) {
      const collection = byCollectionName.get(row.collectionName);
      if (!collection) {
        skipped += 1;
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "skipped",
          reason: "Missing collection in this file."
        });
        continue;
      }
      const existingByName = (_b = (_a = byCollectionAndName.get(collection.id)) == null ? void 0 : _a.get(row.variableName)) != null ? _b : null;
      const existingById = row.id ? (_c = byId.get(row.id)) != null ? _c : null : null;
      const target = existingById != null ? existingById : existingByName;
      if (target) continue;
      try {
        const v = figma.variables.createVariable(row.variableName, collection, row.resolvedType);
        updateVariableInCache(v);
        byId.set(v.id, v);
        let byName = byCollectionAndName.get(collection.id);
        if (!byName) {
          byName = /* @__PURE__ */ new Map();
          byCollectionAndName.set(collection.id, byName);
        }
        byName.set(v.name, v);
        clearLocalVariablesCache(v.resolvedType);
        created += 1;
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "created"
        });
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "Create failed.";
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "failed",
          reason: message
        });
      }
    }
    for (const row of flat) {
      const collection = byCollectionName.get(row.collectionName);
      if (!collection) continue;
      const existingByName = (_e = (_d = byCollectionAndName.get(collection.id)) == null ? void 0 : _d.get(row.variableName)) != null ? _e : null;
      const existingById = row.id ? (_f = byId.get(row.id)) != null ? _f : null : null;
      const target = existingById != null ? existingById : existingByName;
      if (!target) continue;
      if (target.variableCollectionId !== collection.id) {
        skipped += 1;
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "skipped",
          reason: "Variable belongs to a different collection."
        });
        continue;
      }
      if (target.resolvedType !== row.resolvedType) {
        skipped += 1;
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "skipped",
          reason: "Type mismatch; not updating."
        });
        continue;
      }
      try {
        if (existingById && target.name !== row.variableName) {
          const oldName = target.name;
          target.name = row.variableName;
          renamed += 1;
          const byName = (_g = byCollectionAndName.get(collection.id)) != null ? _g : /* @__PURE__ */ new Map();
          byName.delete(oldName);
          byName.set(target.name, target);
          byCollectionAndName.set(collection.id, byName);
        }
        if (isString(row.description)) {
          try {
            target.description = row.description;
          } catch (e) {
          }
        }
        if (Array.isArray(row.scopes) && row.scopes.length) {
          try {
            target.scopes = row.scopes;
          } catch (e) {
          }
        }
        const modeNameToId = new Map(collection.modes.map((m) => [m.name, m.modeId]));
        for (const [modeName, rawValue] of Object.entries((_h = row.values) != null ? _h : {})) {
          const modeId = modeNameToId.get(modeName);
          if (!modeId) continue;
          const alias = await resolveAliasFromSnapshotValue(
            rawValue,
            byCollectionName,
            byCollectionAndName
          );
          if (alias) {
            target.setValueForMode(modeId, alias);
            continue;
          }
          if (row.resolvedType === "COLOR") {
            const rgba = typeof rawValue === "string" ? hexToRgba(rawValue) : null;
            if (rgba) {
              target.setValueForMode(modeId, rgba);
            }
            continue;
          }
          if (row.resolvedType === "FLOAT" && typeof rawValue === "number") {
            target.setValueForMode(modeId, rawValue);
            continue;
          }
          if (row.resolvedType === "BOOLEAN" && typeof rawValue === "boolean") {
            target.setValueForMode(modeId, rawValue);
            continue;
          }
          if (row.resolvedType === "STRING" && typeof rawValue === "string") {
            target.setValueForMode(modeId, rawValue);
            continue;
          }
        }
        if (!existingById) {
          updated += 1;
        }
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "Update failed.";
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "failed",
          reason: message
        });
      }
    }
    return { totals: { created, updated, renamed, skipped, failed }, results };
  };
  return {
    async onActivate() {
      await sendCollectionsList();
    },
    async onMessage(msg) {
      var _a;
      if (getActiveTool() !== "variables-export-import-tool") return false;
      if (msg.type === UI_TO_MAIN.EXPORT_IMPORT_EXPORT_SNAPSHOT) {
        try {
          const payload = await exportVariablesSnapshot((_a = msg.request.collectionIds) != null ? _a : null);
          figma.ui.postMessage({
            type: MAIN_TO_UI.EXPORT_IMPORT_SNAPSHOT_READY,
            payload
          });
          if (payload.files.length === 0) {
            figma.notify("No collections to export");
          } else if (payload.files.length === 1) {
            figma.notify(`Exported: ${payload.files[0].filename}`);
          } else {
            figma.notify(`Snapshot ready: ${payload.files.length} file(s)`);
          }
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Export failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Export failed"
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT) {
        try {
          const payload = await buildVariablesSnapshotImportPreview(msg.request.jsonText);
          figma.ui.postMessage({
            type: MAIN_TO_UI.EXPORT_IMPORT_PREVIEW,
            payload
          });
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Preview failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Preview failed"
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.EXPORT_IMPORT_APPLY_SNAPSHOT) {
        try {
          const payload = await applyVariablesSnapshotImport(msg.request.jsonText);
          figma.ui.postMessage({
            type: MAIN_TO_UI.EXPORT_IMPORT_APPLY_RESULT,
            payload
          });
          const { created, updated, renamed, failed } = payload.totals;
          if (failed === 0) {
            figma.notify(
              `Snapshot imported: created ${created}, updated ${updated}, renamed ${renamed}`
            );
          } else {
            figma.notify(
              `Snapshot imported: created ${created}, updated ${updated}, renamed ${renamed}, failed ${failed}`
            );
          }
          await sendCollectionsList();
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Apply failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Apply failed"
          });
        }
        return true;
      }
      return false;
    }
  };
}
var rgbaToHex, hexToRgba, setNestedObject, formatAliasRef;
var init_main_thread5 = __esm({
  "src/app/tools/variables-export-import/main-thread.ts"() {
    "use strict";
    init_messages();
    init_caching();
    init_json_parsers();
    rgbaToHex = (value) => {
      var _a, _b;
      const clamp013 = (n) => Math.max(0, Math.min(1, n));
      const toHex = (n) => Math.round(clamp013(n) * 255).toString(16).padStart(2, "0");
      const r = toHex(value.r);
      const g = toHex(value.g);
      const b = toHex(value.b);
      const a = toHex((_a = value.a) != null ? _a : 1);
      const hasAlpha = ((_b = value.a) != null ? _b : 1) < 1;
      return `#${r}${g}${b}${hasAlpha ? a : ""}`.toUpperCase();
    };
    hexToRgba = (hex) => {
      const raw = String(hex || "").trim();
      if (!raw.startsWith("#")) return null;
      const h = raw.slice(1);
      if (!(h.length === 6 || h.length === 8)) return null;
      const int = (s) => parseInt(s, 16);
      const r = int(h.slice(0, 2));
      const g = int(h.slice(2, 4));
      const b = int(h.slice(4, 6));
      const a = h.length === 8 ? int(h.slice(6, 8)) : 255;
      if ([r, g, b, a].some((n) => Number.isNaN(n))) return null;
      return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
    };
    setNestedObject = (root, path, value) => {
      var _a, _b;
      let cursor = root;
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = (_a = path[i]) != null ? _a : "";
        if (!key) continue;
        const existing = cursor[key];
        if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
          cursor[key] = {};
        }
        cursor = cursor[key];
      }
      const last = (_b = path[path.length - 1]) != null ? _b : "";
      if (last) {
        cursor[last] = value;
      }
    };
    formatAliasRef = async (aliasId) => {
      var _a;
      const aliasedVar = await getVariable(aliasId);
      if (!aliasedVar) {
        return { $alias: "" };
      }
      const col = await getCollection(aliasedVar.variableCollectionId);
      const colName = (_a = col == null ? void 0 : col.name) != null ? _a : "Unknown collection";
      return { $alias: `${colName}:${aliasedVar.name}` };
    };
  }
});

// src/app/tools/variables-shared/node-utils.ts
var hasChildren, isNodeVisible, hasBoundVariables, hasFills, hasStrokes, hasFillStyleId, hasStrokeStyleId, collectNodesForScope, readBindings, solidPaintToHex, collectSolidColors, paintStyleCache, getPaintStyle, collectStyleAliases, setBoundVariableTry, getVariableNameSuffix, getVariableGroupName, getVariableIdPrefixFromLayerName;
var init_node_utils = __esm({
  "src/app/tools/variables-shared/node-utils.ts"() {
    "use strict";
    hasChildren = (node) => {
      return "children" in node && Array.isArray(node.children);
    };
    isNodeVisible = (node) => {
      return node.visible !== false;
    };
    hasBoundVariables = (node) => {
      return "boundVariables" in node && node.boundVariables !== void 0;
    };
    hasFills = (node) => {
      return "fills" in node;
    };
    hasStrokes = (node) => {
      return "strokes" in node;
    };
    hasFillStyleId = (node) => {
      return "fillStyleId" in node && node.fillStyleId !== void 0;
    };
    hasStrokeStyleId = (node) => {
      return "strokeStyleId" in node && node.strokeStyleId !== void 0;
    };
    collectNodesForScope = (scope, includeHidden) => {
      const roots = scope === "selection" ? figma.currentPage.selection : scope === "page" ? figma.currentPage.children : figma.root.children.flatMap((page) => page.children);
      const stack = roots.map(
        (n) => ({
          node: n,
          inComponent: false,
          inInstance: false
        })
      );
      const result = [];
      while (stack.length) {
        const item = stack.pop();
        if (!item) continue;
        const node = item.node;
        if (!includeHidden && !isNodeVisible(node)) continue;
        const phase = item.inComponent ? item.inInstance ? "instance_in_component" : "component" : "other";
        result.push({ node, phase });
        if (hasChildren(node)) {
          const nextInComponent = item.inComponent || node.type === "COMPONENT";
          const nextInInstance = item.inInstance || node.type === "INSTANCE";
          for (const child of node.children) {
            stack.push({ node: child, inComponent: nextInComponent, inInstance: nextInInstance });
          }
        }
      }
      return result;
    };
    readBindings = (boundVariables) => {
      const entries = [];
      for (const [property, binding] of Object.entries(boundVariables)) {
        if (!binding) continue;
        if (Array.isArray(binding)) {
          for (const item of binding) {
            if (item == null ? void 0 : item.id) {
              entries.push({ variableId: item.id, property });
            }
          }
        } else if (typeof binding === "object" && "id" in binding && binding.id) {
          entries.push({ variableId: binding.id, property });
        }
      }
      return entries;
    };
    solidPaintToHex = (paint) => {
      var _a;
      const toHex = (value) => Math.round(value * 255).toString(16).padStart(2, "0");
      const r = toHex(paint.color.r);
      const g = toHex(paint.color.g);
      const b = toHex(paint.color.b);
      const opacity = (_a = paint.opacity) != null ? _a : 1;
      if (opacity < 1) {
        const a = toHex(opacity);
        return `#${(r + g + b + a).toUpperCase()}`;
      }
      return `#${(r + g + b).toUpperCase()}`;
    };
    collectSolidColors = (node) => {
      const entries = [];
      if (hasFills(node)) {
        const paints = node.fills;
        if (paints && paints !== figma.mixed) {
          for (const paint of paints) {
            if (paint.type === "SOLID" && paint.visible !== false) {
              entries.push({ hex: solidPaintToHex(paint), property: "fills" });
            }
          }
        }
      }
      if (hasStrokes(node)) {
        const paints = node.strokes;
        if (paints && paints !== figma.mixed) {
          for (const paint of paints) {
            if (paint.type === "SOLID" && paint.visible !== false) {
              entries.push({ hex: solidPaintToHex(paint), property: "strokes" });
            }
          }
        }
      }
      return entries;
    };
    paintStyleCache = /* @__PURE__ */ new Map();
    getPaintStyle = async (styleId) => {
      var _a;
      if (paintStyleCache.has(styleId)) {
        return (_a = paintStyleCache.get(styleId)) != null ? _a : null;
      }
      try {
        const style = await figma.getStyleByIdAsync(styleId);
        if (style && style.type === "PAINT") {
          paintStyleCache.set(styleId, style);
          return style;
        }
        paintStyleCache.set(styleId, null);
        return null;
      } catch (e) {
        paintStyleCache.set(styleId, null);
        return null;
      }
    };
    collectStyleAliases = (style) => {
      var _a, _b, _c;
      const aliasIds = [];
      const styleLevelAliases = (_b = (_a = style.boundVariables) == null ? void 0 : _a.paints) != null ? _b : [];
      for (const alias of styleLevelAliases) {
        if (alias == null ? void 0 : alias.id) {
          aliasIds.push(alias.id);
        }
      }
      for (const paint of style.paints) {
        if (paint.type !== "SOLID") continue;
        const bound = (_c = paint.boundVariables) == null ? void 0 : _c.color;
        if (bound == null ? void 0 : bound.id) {
          aliasIds.push(bound.id);
        }
      }
      return aliasIds;
    };
    setBoundVariableTry = (node, property, variable) => {
      const target = node;
      try {
        target.setBoundVariable(property, variable);
        return true;
      } catch (e) {
        return false;
      }
    };
    getVariableNameSuffix = (name) => {
      const parts = name.split("/");
      return parts[parts.length - 1] || "";
    };
    getVariableGroupName = (name) => {
      const parts = name.split("/");
      if (parts.length <= 1) return "";
      return parts.slice(0, -1).join("/");
    };
    getVariableIdPrefixFromLayerName = (name) => {
      const match = /^VariableID:[^\s]+/.exec(String(name || ""));
      return match ? match[0] : null;
    };
  }
});

// src/app/tools/variables-create-linked-colors/main-thread.ts
function registerVariablesCreateLinkedColorsTool(getActiveTool) {
  const getSelectionWithDescendants = (selection) => {
    const stack = [...selection];
    const result = [];
    while (stack.length) {
      const node = stack.pop();
      if (!node) continue;
      if (!isNodeVisible(node)) continue;
      result.push(node);
      if (hasChildren(node)) {
        stack.push(...node.children);
      }
    }
    return result;
  };
  const addVariableUsage = async (variableId, property, node, variableMap) => {
    var _a;
    const variable = await getVariable(variableId);
    if (!variable) return;
    let usage = variableMap.get(variable.id);
    if (!usage) {
      const collection = await getCollection(variable.variableCollectionId);
      usage = {
        id: variable.id,
        name: variable.name,
        collectionId: variable.variableCollectionId,
        collectionName: (_a = collection == null ? void 0 : collection.name) != null ? _a : "Unknown collection",
        resolvedType: variable.resolvedType,
        properties: [],
        nodes: [],
        defaultName: variable.name,
        matches: [],
        options: [],
        groups: []
      };
      variableMap.set(variable.id, usage);
    }
    if (!usage.properties.includes(property)) {
      usage.properties.push(property);
    }
    if (!usage.nodes.some((entry) => entry.id === node.id)) {
      usage.nodes.push({ id: node.id, name: node.name || node.type });
    }
  };
  const collectStyleVariableBindings = async (node, variableMap) => {
    const promises = [];
    if (hasFillStyleId(node)) {
      const styleId = node.fillStyleId;
      if (typeof styleId === "string" && styleId.length) {
        promises.push(
          (async () => {
            const style = await getPaintStyle(styleId);
            if (!style) return;
            const aliases = collectStyleAliases(style);
            for (const alias of aliases) {
              await addVariableUsage(alias, `fills (style ${style.name})`, node, variableMap);
            }
          })()
        );
      }
    }
    if (hasStrokeStyleId(node)) {
      const styleId = node.strokeStyleId;
      if (typeof styleId === "string" && styleId.length) {
        promises.push(
          (async () => {
            const style = await getPaintStyle(styleId);
            if (!style) return;
            const aliases = collectStyleAliases(style);
            for (const alias of aliases) {
              await addVariableUsage(alias, `strokes (style ${style.name})`, node, variableMap);
            }
          })()
        );
      }
    }
    if (promises.length) {
      await Promise.all(promises);
    }
  };
  const attachMatchesToVariables = async (variableMap) => {
    const usages = Array.from(variableMap.values());
    await Promise.all(
      usages.map(async (usage) => {
        var _a;
        const variable = await getVariable(usage.id);
        if (!variable) {
          usage.matches = [];
          return;
        }
        const suffix = getVariableNameSuffix(variable.name);
        usage.defaultName = variable.name;
        const candidates = await getLocalVariablesForType(variable.resolvedType);
        const candidateSummaries = [];
        for (const candidate of candidates) {
          if (candidate.id === variable.id) continue;
          const collection = await getCollection(candidate.variableCollectionId);
          candidateSummaries.push({
            id: candidate.id,
            name: candidate.name,
            collectionId: candidate.variableCollectionId,
            collectionName: (_a = collection == null ? void 0 : collection.name) != null ? _a : "Unknown collection"
          });
        }
        candidateSummaries.sort((a, b) => a.name.localeCompare(b.name));
        usage.options = candidateSummaries;
        const groupSet = /* @__PURE__ */ new Set();
        for (const option of candidateSummaries) {
          groupSet.add(getVariableGroupName(option.name));
        }
        usage.groups = Array.from(groupSet).sort((a, b) => a.localeCompare(b));
        if (!suffix) {
          usage.matches = [];
          return;
        }
        const suffixLower = suffix.toLowerCase();
        const matches = candidateSummaries.filter(
          (candidate) => candidate.name.toLowerCase().includes(suffixLower)
        );
        usage.matches = matches.sort((a, b) => a.name.localeCompare(b.name));
      })
    );
  };
  const getVariablesFromSelection = async () => {
    const selection = figma.currentPage.selection;
    const nodesToInspect = getSelectionWithDescendants(selection);
    const variableMap = /* @__PURE__ */ new Map();
    const colorMap = /* @__PURE__ */ new Map();
    for (const node of nodesToInspect) {
      if (hasBoundVariables(node)) {
        const bindings = readBindings(node.boundVariables);
        for (const binding of bindings) {
          await addVariableUsage(binding.variableId, binding.property, node, variableMap);
        }
      }
      await collectStyleVariableBindings(node, variableMap);
      const solidColors = collectSolidColors(node);
      for (const colorEntry of solidColors) {
        let usage = colorMap.get(colorEntry.hex);
        if (!usage) {
          usage = {
            hex: colorEntry.hex,
            properties: [],
            nodes: []
          };
          colorMap.set(colorEntry.hex, usage);
        }
        if (!usage.properties.includes(colorEntry.property)) {
          usage.properties.push(colorEntry.property);
        }
        if (!usage.nodes.some((entry) => entry.id === node.id)) {
          usage.nodes.push({ id: node.id, name: node.name || node.type });
        }
      }
    }
    await attachMatchesToVariables(variableMap);
    const variables = Array.from(variableMap.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    const colors = Array.from(colorMap.values()).sort((a, b) => a.hex.localeCompare(b.hex));
    return { variables, selectionSize: selection.length, colors };
  };
  const sendSelectionInfo = async () => {
    const payload = await getVariablesFromSelection();
    figma.ui.postMessage({
      type: MAIN_TO_UI.LINKED_COLORS_SELECTION,
      payload
    });
  };
  const sendCollectionsList = async () => {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const collectionsInfo = await Promise.all(
      collections.map(async (c) => {
        var _a;
        const collection = await figma.variables.getVariableCollectionByIdAsync(c.id);
        return {
          id: c.id,
          name: c.name,
          modeCount: c.modes.length,
          variableCount: (_a = collection == null ? void 0 : collection.variableIds.length) != null ? _a : 0
        };
      })
    );
    figma.ui.postMessage({
      type: MAIN_TO_UI.LINKED_COLORS_COLLECTIONS_LIST,
      collections: collectionsInfo
    });
  };
  const rebindSelectionToVariable = (sourceVariableId, targetVariable) => {
    const selection = figma.currentPage.selection;
    const nodes = getSelectionWithDescendants(selection);
    for (const node of nodes) {
      if (!hasBoundVariables(node) || !node.boundVariables) continue;
      for (const [property, binding] of Object.entries(node.boundVariables)) {
        if (!binding) continue;
        if (property === "fills" && Array.isArray(binding)) {
          if (hasFills(node)) {
            const paints = node.fills;
            if (paints && paints !== figma.mixed) {
              const updated = paints.map((paint, index) => {
                const alias = binding[index];
                if (!(alias == null ? void 0 : alias.id) || alias.id !== sourceVariableId || paint.type !== "SOLID") {
                  return paint;
                }
                return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable);
              });
              const changed = updated.some((p, i) => p !== paints[i]);
              if (changed) {
                node.fills = updated;
              }
            }
          }
          continue;
        }
        if (property === "strokes" && Array.isArray(binding)) {
          if (hasStrokes(node)) {
            const paints = node.strokes;
            if (paints) {
              const updated = paints.map((paint, index) => {
                const alias = binding[index];
                if (!(alias == null ? void 0 : alias.id) || alias.id !== sourceVariableId || paint.type !== "SOLID") {
                  return paint;
                }
                return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable);
              });
              const changed = updated.some((p, i) => p !== paints[i]);
              if (changed) {
                node.strokes = updated;
              }
            }
          }
          continue;
        }
        if (!Array.isArray(binding) && binding.id === sourceVariableId) {
          try {
            const target = node;
            target.setBoundVariable(property, targetVariable);
          } catch (e) {
          }
        }
      }
    }
  };
  const createLinkedVariable = async (sourceVariableId, requestedName) => {
    const trimmedName = requestedName.trim();
    if (!trimmedName) {
      throw new Error("Provide a name for the new variable.");
    }
    const sourceVariable = await getVariable(sourceVariableId);
    if (!sourceVariable) {
      throw new Error("Source variable no longer exists.");
    }
    const collection = await getCollection(sourceVariable.variableCollectionId);
    if (!collection) {
      throw new Error("Collection missing for the selected variable.");
    }
    const newVariable = figma.variables.createVariable(
      trimmedName,
      collection,
      sourceVariable.resolvedType
    );
    updateVariableInCache(newVariable);
    for (const mode of collection.modes) {
      newVariable.setValueForMode(mode.modeId, {
        type: "VARIABLE_ALIAS",
        id: sourceVariable.id
      });
    }
    rebindSelectionToVariable(sourceVariable.id, newVariable);
    return { variableName: newVariable.name, collectionName: collection.name };
  };
  const applyExistingVariable = async (sourceVariableId, targetVariableId) => {
    var _a;
    const targetVariable = await getVariable(targetVariableId);
    if (!targetVariable) {
      throw new Error("Selected variable no longer exists.");
    }
    rebindSelectionToVariable(sourceVariableId, targetVariable);
    const collection = await getCollection(targetVariable.variableCollectionId);
    return {
      variableName: targetVariable.name,
      collectionName: (_a = collection == null ? void 0 : collection.name) != null ? _a : "Unknown collection"
    };
  };
  const renameVariable = async (variableId, requestedName) => {
    var _a;
    const trimmedName = requestedName.trim();
    if (!trimmedName) {
      throw new Error("Provide a name to rename the variable.");
    }
    const variable = await getVariable(variableId);
    if (!variable) {
      throw new Error("Selected variable no longer exists.");
    }
    if (variable.name !== trimmedName) {
      variable.name = trimmedName;
      updateVariableInCache(variable);
      clearLocalVariablesCache(variable.resolvedType);
    }
    const collection = await getCollection(variable.variableCollectionId);
    return { variableName: variable.name, collectionName: (_a = collection == null ? void 0 : collection.name) != null ? _a : "Unknown collection" };
  };
  figma.on("selectionchange", () => {
    if (getActiveTool() === "variables-create-linked-colors-tool") {
      sendSelectionInfo();
    }
  });
  return {
    async onActivate() {
      await sendSelectionInfo();
      await sendCollectionsList();
    },
    async onMessage(msg) {
      if (getActiveTool() !== "variables-create-linked-colors-tool") return false;
      if (msg.type === UI_TO_MAIN.LINKED_COLORS_CREATE) {
        try {
          const { variableId, targetVariableId } = msg.request;
          const result = await createLinkedVariable(variableId, targetVariableId);
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS,
            result: {
              success: true,
              message: `Created variable "${result.variableName}"`
            }
          });
          figma.notify(`Created variable "${result.variableName}"`);
          await sendSelectionInfo();
        } catch (e) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS,
            result: {
              success: false,
              message: e instanceof Error ? e.message : String(e)
            }
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.LINKED_COLORS_APPLY_EXISTING) {
        try {
          const { variableId, targetVariableId } = msg.request;
          const result = await applyExistingVariable(variableId, targetVariableId);
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS,
            result: {
              success: true,
              message: `Applied "${result.variableName}"`
            }
          });
          figma.notify(`Applied variable "${result.variableName}"`);
          await sendSelectionInfo();
        } catch (e) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS,
            result: {
              success: false,
              message: e instanceof Error ? e.message : String(e)
            }
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.LINKED_COLORS_RENAME) {
        try {
          const { variableId, newName } = msg.request;
          const result = await renameVariable(variableId, newName);
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS,
            result: {
              success: true,
              message: `Renamed to "${result.variableName}"`,
              newName: result.variableName
            }
          });
          figma.notify(`Renamed variable to "${result.variableName}"`);
          await sendSelectionInfo();
        } catch (e) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS,
            result: {
              success: false,
              message: e instanceof Error ? e.message : String(e)
            }
          });
        }
        return true;
      }
      return false;
    }
  };
}
var init_main_thread6 = __esm({
  "src/app/tools/variables-create-linked-colors/main-thread.ts"() {
    "use strict";
    init_messages();
    init_caching();
    init_node_utils();
  }
});

// src/app/tools/variables-replace-usages/main-thread.ts
function registerVariablesReplaceUsagesTool(getActiveTool) {
  const getSelectionWithDescendants = (selection) => {
    const stack = [...selection];
    const result = [];
    while (stack.length) {
      const node = stack.pop();
      if (!node) continue;
      if (!isNodeVisible(node)) continue;
      result.push(node);
      if (hasChildren(node)) {
        stack.push(...node.children);
      }
    }
    return result;
  };
  const addVariableUsage = async (variableId, property, node, variableMap) => {
    var _a;
    const variable = await getVariable(variableId);
    if (!variable) return;
    let usage = variableMap.get(variable.id);
    if (!usage) {
      const collection = await getCollection(variable.variableCollectionId);
      usage = {
        id: variable.id,
        name: variable.name,
        collectionId: variable.variableCollectionId,
        collectionName: (_a = collection == null ? void 0 : collection.name) != null ? _a : "Unknown collection",
        resolvedType: variable.resolvedType,
        properties: [],
        nodes: [],
        defaultName: variable.name,
        matches: [],
        options: [],
        groups: []
      };
      variableMap.set(variable.id, usage);
    }
    if (!usage.properties.includes(property)) {
      usage.properties.push(property);
    }
    if (!usage.nodes.some((entry) => entry.id === node.id)) {
      usage.nodes.push({ id: node.id, name: node.name || node.type });
    }
  };
  const getVariablesFromSelection = async () => {
    var _a;
    const selection = figma.currentPage.selection;
    const nodesToInspect = getSelectionWithDescendants(selection);
    const variableMap = /* @__PURE__ */ new Map();
    const colorMap = /* @__PURE__ */ new Map();
    for (const node of nodesToInspect) {
      if (hasBoundVariables(node)) {
        const bindings = readBindings(node.boundVariables);
        for (const binding of bindings) {
          await addVariableUsage(binding.variableId, binding.property, node, variableMap);
        }
      }
      const solidColors = collectSolidColors(node);
      for (const colorEntry of solidColors) {
        let usage = colorMap.get(colorEntry.hex);
        if (!usage) {
          usage = {
            hex: colorEntry.hex,
            properties: [],
            nodes: []
          };
          colorMap.set(colorEntry.hex, usage);
        }
        if (!usage.properties.includes(colorEntry.property)) {
          usage.properties.push(colorEntry.property);
        }
        if (!usage.nodes.some((entry) => entry.id === node.id)) {
          usage.nodes.push({ id: node.id, name: node.name || node.type });
        }
      }
    }
    for (const usage of Array.from(variableMap.values())) {
      const variable = await getVariable(usage.id);
      if (!variable) continue;
      const suffix = getVariableNameSuffix(variable.name);
      usage.defaultName = variable.name;
      const candidates = await getAllLocalVariables([variable.resolvedType]);
      const candidateSummaries = [];
      for (const candidate of candidates) {
        if (candidate.id === variable.id) continue;
        const collection = await getCollection(candidate.variableCollectionId);
        candidateSummaries.push({
          id: candidate.id,
          name: candidate.name,
          collectionId: candidate.variableCollectionId,
          collectionName: (_a = collection == null ? void 0 : collection.name) != null ? _a : "Unknown collection"
        });
      }
      candidateSummaries.sort((a, b) => a.name.localeCompare(b.name));
      usage.options = candidateSummaries;
      const groupSet = /* @__PURE__ */ new Set();
      for (const option of candidateSummaries) {
        groupSet.add(getVariableGroupName(option.name));
      }
      usage.groups = Array.from(groupSet).sort((a, b) => a.localeCompare(b));
      if (suffix) {
        const suffixLower = suffix.toLowerCase();
        usage.matches = candidateSummaries.filter((c) => c.name.toLowerCase().includes(suffixLower)).sort((a, b) => a.name.localeCompare(b.name));
      } else {
        usage.matches = [];
      }
    }
    const variables = Array.from(variableMap.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    const colors = Array.from(colorMap.values()).sort((a, b) => a.hex.localeCompare(b.hex));
    return { variables, selectionSize: selection.length, colors };
  };
  const sendSelectionInfo = async () => {
    const payload = await getVariablesFromSelection();
    figma.ui.postMessage({
      type: MAIN_TO_UI.REPLACE_USAGES_SELECTION,
      payload
    });
  };
  const resolveCollectionForMapping = async (doc) => {
    if (doc.collectionId) {
      const byId = await getCollection(doc.collectionId);
      if (!byId) {
        throw new Error("Mapping collectionId not found in this file.");
      }
      return byId;
    }
    if (doc.collectionName) {
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      const match = collections.find((c) => c.name === doc.collectionName);
      if (!match) {
        throw new Error("Mapping collectionName not found in this file.");
      }
      return match;
    }
    throw new Error("Mapping must include collectionName or collectionId.");
  };
  const buildUsagesReplaceMappingFromJson = async (jsonText) => {
    var _a, _b;
    const doc = parseUsagesReplaceMappingJson(jsonText);
    const collection = await resolveCollectionForMapping(doc);
    const vars = await getAllLocalVariables(["COLOR"]);
    const byName = /* @__PURE__ */ new Map();
    for (const v of vars) {
      if (v.variableCollectionId !== collection.id) continue;
      if (!byName.has(v.name)) byName.set(v.name, v);
    }
    const entries = [];
    const invalidMappingRows = [];
    const seenFrom = /* @__PURE__ */ new Set();
    for (const r of doc.replacements) {
      const from = r.from;
      const to = r.to;
      if (!from || !to) {
        invalidMappingRows.push({ from, to, status: "invalid", reason: "Missing from/to." });
        continue;
      }
      if (seenFrom.has(from)) {
        invalidMappingRows.push({
          from,
          to,
          status: "duplicate_from",
          reason: 'Duplicate "from" row (keep only one).'
        });
        continue;
      }
      seenFrom.add(from);
      const sourceVar = (_a = byName.get(from)) != null ? _a : null;
      if (!sourceVar) {
        invalidMappingRows.push({
          from,
          to,
          status: "missing_source",
          reason: "Source variable not found by name."
        });
        continue;
      }
      const targetVar = (_b = byName.get(to)) != null ? _b : null;
      if (!targetVar) {
        invalidMappingRows.push({
          from,
          to,
          status: "missing_target",
          reason: "Target variable not found by name."
        });
        continue;
      }
      if (sourceVar.id === targetVar.id) {
        invalidMappingRows.push({ from, to, status: "ok", reason: "No-op (same variable)." });
        continue;
      }
      const row = {
        sourceId: sourceVar.id,
        sourceName: sourceVar.name,
        sourceCollectionId: sourceVar.variableCollectionId,
        sourceCollectionName: collection.name,
        targetId: targetVar.id,
        targetName: targetVar.name,
        reason: "imported mapping",
        bindingsTotal: 0,
        bindingsByPhase: { component: 0, instance_in_component: 0, other: 0 },
        nodesTotal: 0,
        nodesByPhase: { component: 0, instance_in_component: 0, other: 0 },
        defaultName: sourceVar.name
      };
      entries.push({ row, targetVariable: targetVar });
      invalidMappingRows.push({ from, to, status: "ok" });
    }
    entries.sort((a, b) => a.row.sourceName.localeCompare(b.row.sourceName));
    return { entries, invalidMappingRows };
  };
  const scanUsagesReplacePreview = async (scope, renamePrints, includeHidden, mappingJsonText) => {
    if (!mappingJsonText.trim()) {
      throw new Error("Mapping JSON is required. Please load a mapping file.");
    }
    const { entries, invalidMappingRows } = await buildUsagesReplaceMappingFromJson(mappingJsonText);
    const bySourceId = new Map(
      entries.map((e) => [e.row.sourceId, e])
    );
    const perRowNodeSets = /* @__PURE__ */ new Map();
    for (const e of entries) {
      perRowNodeSets.set(e.row.sourceId, {
        component: /* @__PURE__ */ new Set(),
        instance_in_component: /* @__PURE__ */ new Set(),
        other: /* @__PURE__ */ new Set()
      });
    }
    const nodesWithChangesByPhase = {
      component: /* @__PURE__ */ new Set(),
      instance_in_component: /* @__PURE__ */ new Set(),
      other: /* @__PURE__ */ new Set()
    };
    let bindingsWithChanges = 0;
    const bindingsWithChangesByPhase = {
      component: 0,
      instance_in_component: 0,
      other: 0
    };
    let printsRenameCandidates = 0;
    const nodes = collectNodesForScope(scope, includeHidden);
    for (const { node, phase } of nodes) {
      if (node.locked === true) {
        continue;
      }
      if (!hasBoundVariables(node) || !node.boundVariables) {
        if (renamePrints && node.type === "TEXT") {
          const sourceIdFromName = getVariableIdPrefixFromLayerName(node.name);
          if (sourceIdFromName && bySourceId.has(sourceIdFromName)) {
            printsRenameCandidates += 1;
          }
        }
        continue;
      }
      for (const [property, binding] of Object.entries(node.boundVariables)) {
        if (!binding) continue;
        const handleId = (id) => {
          const hit = bySourceId.get(id);
          if (!hit) return;
          hit.row.bindingsTotal += 1;
          hit.row.bindingsByPhase[phase] += 1;
          bindingsWithChanges += 1;
          bindingsWithChangesByPhase[phase] += 1;
          nodesWithChangesByPhase[phase].add(node.id);
          const sets = perRowNodeSets.get(id);
          sets == null ? void 0 : sets[phase].add(node.id);
        };
        if ((property === "fills" || property === "strokes") && Array.isArray(binding)) {
          for (const item of binding) {
            if (item == null ? void 0 : item.id) {
              handleId(item.id);
            }
          }
          continue;
        }
        if (!Array.isArray(binding) && typeof binding === "object" && "id" in binding && binding.id) {
          handleId(String(binding.id));
        }
      }
      if (renamePrints && node.type === "TEXT") {
        const sourceIdFromName = getVariableIdPrefixFromLayerName(node.name);
        if (sourceIdFromName && bySourceId.has(sourceIdFromName)) {
          printsRenameCandidates += 1;
        }
      }
    }
    for (const e of entries) {
      const sets = perRowNodeSets.get(e.row.sourceId);
      if (!sets) continue;
      e.row.nodesByPhase.component = sets.component.size;
      e.row.nodesByPhase.instance_in_component = sets.instance_in_component.size;
      e.row.nodesByPhase.other = sets.other.size;
      e.row.nodesTotal = sets.component.size + sets.instance_in_component.size + sets.other.size;
    }
    const nodesWithChanges = nodesWithChangesByPhase.component.size + nodesWithChangesByPhase.instance_in_component.size + nodesWithChangesByPhase.other.size;
    return {
      scope,
      totals: {
        mappings: entries.length,
        invalidMappingRows: invalidMappingRows.length,
        nodesWithChanges,
        bindingsWithChanges,
        nodesWithChangesByPhase: {
          component: nodesWithChangesByPhase.component.size,
          instance_in_component: nodesWithChangesByPhase.instance_in_component.size,
          other: nodesWithChangesByPhase.other.size
        },
        bindingsWithChangesByPhase,
        printsRenameCandidates
      },
      mappings: entries.map((e) => e.row).filter((r) => r.bindingsTotal > 0),
      invalidMappingRows
    };
  };
  const applyUsagesReplace = async (scope, renamePrints, includeHidden, mappingJsonText, onProgress) => {
    if (!mappingJsonText.trim()) {
      throw new Error("Mapping JSON is required. Please load a mapping file.");
    }
    const { entries } = await buildUsagesReplaceMappingFromJson(mappingJsonText);
    const mappingBySourceId = new Map(
      entries.map((e) => [e.row.sourceId, e.targetVariable])
    );
    const nodes = collectNodesForScope(scope, includeHidden);
    const buckets = {
      component: [],
      instance_in_component: [],
      other: []
    };
    for (const item of nodes) {
      buckets[item.phase].push(item.node);
    }
    const ordered = [
      ...buckets.component,
      ...buckets.instance_in_component,
      ...buckets.other
    ];
    const total = ordered.length;
    let done = 0;
    let nodesVisited = 0;
    let nodesChanged = 0;
    let bindingsChanged = 0;
    let nodesSkippedLocked = 0;
    let bindingsSkippedUnsupported = 0;
    let bindingsFailed = 0;
    let printsRenamed = 0;
    if (onProgress) {
      onProgress(0, total);
    }
    for (const node of ordered) {
      nodesVisited += 1;
      if (node.locked === true) {
        nodesSkippedLocked += 1;
        done += 1;
        if (onProgress && (done % 50 === 0 || done === total)) onProgress(done, total);
        continue;
      }
      let nodeHadChanges = false;
      const sourceIdFromName = renamePrints && node.type === "TEXT" ? getVariableIdPrefixFromLayerName(node.name) : null;
      if (renamePrints && node.type === "TEXT" && sourceIdFromName) {
        const targetVar = mappingBySourceId.get(sourceIdFromName);
        if (targetVar) {
          const prefix = sourceIdFromName;
          const rest = node.name.slice(prefix.length);
          const nextName = `${targetVar.id}${rest}`;
          if (nextName !== node.name) {
            node.name = nextName;
            printsRenamed += 1;
            nodeHadChanges = true;
          }
        }
      }
      if (!hasBoundVariables(node) || !node.boundVariables) {
        if (nodeHadChanges) {
          nodesChanged += 1;
        }
        done += 1;
        if (onProgress && (done % 50 === 0 || done === total)) onProgress(done, total);
        continue;
      }
      for (const [property, binding] of Object.entries(node.boundVariables)) {
        if (!binding) continue;
        if (property === "fills" && Array.isArray(binding)) {
          if (!hasFills(node)) {
            bindingsSkippedUnsupported += binding.length;
            continue;
          }
          const paintsValue = node.fills;
          if (!paintsValue || paintsValue === figma.mixed) {
            continue;
          }
          const updated = paintsValue.map((paint, index) => {
            const alias = binding[index];
            if (!(alias == null ? void 0 : alias.id) || paint.type !== "SOLID") {
              return paint;
            }
            const targetVar = mappingBySourceId.get(alias.id);
            if (!targetVar) {
              return paint;
            }
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVar);
          });
          const changed = updated.some((p, i) => p !== paintsValue[i]);
          if (changed) {
            node.fills = updated;
            for (const alias of binding) {
              if ((alias == null ? void 0 : alias.id) && mappingBySourceId.has(alias.id)) {
                bindingsChanged += 1;
              }
            }
            nodeHadChanges = true;
          }
          continue;
        }
        if (property === "strokes" && Array.isArray(binding)) {
          if (!hasStrokes(node)) {
            bindingsSkippedUnsupported += binding.length;
            continue;
          }
          const paintsValue = node.strokes;
          if (!paintsValue) {
            continue;
          }
          const updated = paintsValue.map((paint, index) => {
            const alias = binding[index];
            if (!(alias == null ? void 0 : alias.id) || paint.type !== "SOLID") {
              return paint;
            }
            const targetVar = mappingBySourceId.get(alias.id);
            if (!targetVar) {
              return paint;
            }
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVar);
          });
          const changed = updated.some((p, i) => p !== paintsValue[i]);
          if (changed) {
            node.strokes = updated;
            for (const alias of binding) {
              if ((alias == null ? void 0 : alias.id) && mappingBySourceId.has(alias.id)) {
                bindingsChanged += 1;
              }
            }
            nodeHadChanges = true;
          }
          continue;
        }
        if (!Array.isArray(binding) && typeof binding === "object" && "id" in binding && binding.id) {
          const sourceId = String(binding.id);
          const targetVar = mappingBySourceId.get(sourceId);
          if (!targetVar) {
            continue;
          }
          const ok = setBoundVariableTry(node, property, targetVar);
          if (ok) {
            bindingsChanged += 1;
            nodeHadChanges = true;
          } else {
            bindingsFailed += 1;
          }
          continue;
        }
        if (Array.isArray(binding)) {
          bindingsSkippedUnsupported += binding.length;
        }
      }
      if (nodeHadChanges) {
        nodesChanged += 1;
      }
      done += 1;
      if (onProgress && (done % 50 === 0 || done === total)) {
        onProgress(done, total);
      }
    }
    return {
      totals: {
        nodesVisited,
        nodesChanged,
        bindingsChanged,
        nodesSkippedLocked,
        bindingsSkippedUnsupported,
        bindingsFailed,
        printsRenamed
      }
    };
  };
  figma.on("selectionchange", () => {
    if (getActiveTool() === "variables-replace-usages-tool") {
      sendSelectionInfo();
    }
  });
  return {
    async onActivate() {
      await sendSelectionInfo();
    },
    async onMessage(msg) {
      if (getActiveTool() !== "variables-replace-usages-tool") return false;
      if (msg.type === UI_TO_MAIN.REPLACE_USAGES_PREVIEW) {
        try {
          const { scope, renamePrints, includeHidden, mappingJsonText } = msg.request;
          const payload = await scanUsagesReplacePreview(
            scope,
            renamePrints,
            includeHidden,
            mappingJsonText != null ? mappingJsonText : ""
          );
          figma.ui.postMessage({
            type: MAIN_TO_UI.REPLACE_USAGES_PREVIEW,
            payload
          });
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Preview failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Preview failed"
          });
        }
        return true;
      }
      if (msg.type === UI_TO_MAIN.REPLACE_USAGES_APPLY) {
        try {
          const { scope, renamePrints, includeHidden, mappingJsonText } = msg.request;
          const payload = await applyUsagesReplace(
            scope,
            renamePrints,
            includeHidden,
            mappingJsonText != null ? mappingJsonText : "",
            (done, total) => {
              figma.ui.postMessage({
                type: MAIN_TO_UI.REPLACE_USAGES_APPLY_PROGRESS,
                progress: {
                  current: done,
                  total,
                  message: `Replacing usages... ${done}/${total}`
                }
              });
            }
          );
          figma.ui.postMessage({
            type: MAIN_TO_UI.REPLACE_USAGES_APPLY_RESULT,
            payload
          });
          const { nodesChanged, bindingsChanged, printsRenamed } = payload.totals;
          figma.notify(
            `Replaced: ${bindingsChanged} bindings in ${nodesChanged} nodes, ${printsRenamed} prints renamed`
          );
          await sendSelectionInfo();
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Apply failed");
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Apply failed"
          });
        }
        return true;
      }
      return false;
    }
  };
}
var init_main_thread7 = __esm({
  "src/app/tools/variables-replace-usages/main-thread.ts"() {
    "use strict";
    init_messages();
    init_caching();
    init_node_utils();
    init_json_parsers();
  }
});

// src/app/run.ts
function getToolTitle(command) {
  switch (command) {
    case "mockup-markup-tool":
      return "Mockup Markup Quick Apply";
    case "color-chain-tool":
      return "View Colors Chain";
    case "print-color-usages-tool":
      return "Print Color Usages";
    case "variables-export-import-tool":
      return "Variables Export Import";
    case "variables-batch-rename-tool":
      return "Variables Batch Rename";
    case "variables-create-linked-colors-tool":
      return "Variables Create Linked Colors";
    case "variables-replace-usages-tool":
      return "Variables Replace Usages";
    default:
      return "JetBrains Design Tools";
  }
}
function run(command) {
  showUI(
    {
      width: 360,
      height: 500,
      title: getToolTitle(command)
    },
    { command }
  );
  const toolCommands = [
    "mockup-markup-tool",
    "color-chain-tool",
    "print-color-usages-tool",
    "variables-export-import-tool",
    "variables-batch-rename-tool",
    "variables-create-linked-colors-tool",
    "variables-replace-usages-tool"
  ];
  let activeTool = toolCommands.includes(command) ? command : "home";
  const getActiveTool = () => activeTool;
  const colorChain = registerColorChainTool(getActiveTool);
  const printColorUsages = registerPrintColorUsagesTool(getActiveTool);
  const mockupMarkup = registerMockupMarkupTool(getActiveTool);
  const variablesBatchRename = registerVariablesBatchRenameTool(getActiveTool);
  const variablesExportImport = registerVariablesExportImportTool(getActiveTool);
  const variablesCreateLinkedColors = registerVariablesCreateLinkedColorsTool(getActiveTool);
  const variablesReplaceUsages = registerVariablesReplaceUsagesTool(getActiveTool);
  const activate = async (tool) => {
    activeTool = tool;
    if (tool === "mockup-markup-tool") {
      await mockupMarkup.onActivate();
      return;
    }
    if (tool === "color-chain-tool") {
      await colorChain.onActivate();
      return;
    }
    if (tool === "print-color-usages-tool") {
      await printColorUsages.onActivate();
      return;
    }
    if (tool === "variables-export-import-tool") {
      await variablesExportImport.onActivate();
      return;
    }
    if (tool === "variables-batch-rename-tool") {
      await variablesBatchRename.onActivate();
      return;
    }
    if (tool === "variables-create-linked-colors-tool") {
      await variablesCreateLinkedColors.onActivate();
      return;
    }
    if (tool === "variables-replace-usages-tool") {
      await variablesReplaceUsages.onActivate();
      return;
    }
  };
  figma.ui.onmessage = async (msg) => {
    try {
      if (msg.type === UI_TO_MAIN.BOOT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.BOOTSTRAPPED,
          command,
          selectionSize: figma.currentPage.selection.length
        });
        await activate(activeTool);
        return;
      }
      if (msg.type === UI_TO_MAIN.SET_ACTIVE_TOOL) {
        await activate(msg.tool);
        return;
      }
      if (await mockupMarkup.onMessage(msg)) return;
      if (await printColorUsages.onMessage(msg)) return;
      if (await colorChain.onMessage(msg)) return;
      if (await variablesBatchRename.onMessage(msg)) return;
      if (await variablesExportImport.onMessage(msg)) return;
      if (await variablesCreateLinkedColors.onMessage(msg)) return;
      if (await variablesReplaceUsages.onMessage(msg)) return;
    } catch (e) {
      console.log("[run] Unhandled error in onmessage", e);
      try {
        figma.notify(e instanceof Error ? e.message : String(e));
      } catch (e2) {
      }
    }
  };
}
var init_run = __esm({
  "src/app/run.ts"() {
    "use strict";
    init_lib();
    init_messages();
    init_main_thread();
    init_main_thread2();
    init_main_thread3();
    init_main_thread4();
    init_main_thread5();
    init_main_thread6();
    init_main_thread7();
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

// src/mockup-markup-tool/main.ts
var main_exports2 = {};
__export(main_exports2, {
  default: () => main_default2
});
function main_default2() {
  run("mockup-markup-tool");
}
var init_main2 = __esm({
  "src/mockup-markup-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/color-chain-tool/main.ts
var main_exports3 = {};
__export(main_exports3, {
  default: () => main_default3
});
function main_default3() {
  run("color-chain-tool");
}
var init_main3 = __esm({
  "src/color-chain-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/print-color-usages-tool/main.ts
var main_exports4 = {};
__export(main_exports4, {
  default: () => main_default4
});
function main_default4() {
  run("print-color-usages-tool");
}
var init_main4 = __esm({
  "src/print-color-usages-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/variables-export-import-tool/main.ts
var main_exports5 = {};
__export(main_exports5, {
  default: () => main_default5
});
function main_default5() {
  run("variables-export-import-tool");
}
var init_main5 = __esm({
  "src/variables-export-import-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/variables-batch-rename-tool/main.ts
var main_exports6 = {};
__export(main_exports6, {
  default: () => main_default6
});
function main_default6() {
  run("variables-batch-rename-tool");
}
var init_main6 = __esm({
  "src/variables-batch-rename-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/variables-create-linked-colors-tool/main.ts
var main_exports7 = {};
__export(main_exports7, {
  default: () => main_default7
});
function main_default7() {
  run("variables-create-linked-colors-tool");
}
var init_main7 = __esm({
  "src/variables-create-linked-colors-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/variables-replace-usages-tool/main.ts
var main_exports8 = {};
__export(main_exports8, {
  default: () => main_default8
});
function main_default8() {
  run("variables-replace-usages-tool");
}
var init_main8 = __esm({
  "src/variables-replace-usages-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// <stdin>
var modules = { "src/home/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"], "src/mockup-markup-tool/main.ts--default": (init_main2(), __toCommonJS(main_exports2))["default"], "src/color-chain-tool/main.ts--default": (init_main3(), __toCommonJS(main_exports3))["default"], "src/print-color-usages-tool/main.ts--default": (init_main4(), __toCommonJS(main_exports4))["default"], "src/variables-export-import-tool/main.ts--default": (init_main5(), __toCommonJS(main_exports5))["default"], "src/variables-batch-rename-tool/main.ts--default": (init_main6(), __toCommonJS(main_exports6))["default"], "src/variables-create-linked-colors-tool/main.ts--default": (init_main7(), __toCommonJS(main_exports7))["default"], "src/variables-replace-usages-tool/main.ts--default": (init_main8(), __toCommonJS(main_exports8))["default"] };
var commandId = typeof figma.command === "undefined" || figma.command === "" || figma.command === "generate" ? "src/home/main.ts--default" : figma.command;
modules[commandId]();
