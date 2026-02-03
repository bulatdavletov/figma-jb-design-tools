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
      PRINT_COLOR_USAGES_LOAD_SETTINGS: "PRINT_COLOR_USAGES_LOAD_SETTINGS",
      PRINT_COLOR_USAGES_SAVE_SETTINGS: "PRINT_COLOR_USAGES_SAVE_SETTINGS",
      PRINT_COLOR_USAGES_PRINT: "PRINT_COLOR_USAGES_PRINT",
      PRINT_COLOR_USAGES_UPDATE: "PRINT_COLOR_USAGES_UPDATE",
      MOCKUP_MARKUP_LOAD_STATE: "MOCKUP_MARKUP_LOAD_STATE",
      MOCKUP_MARKUP_APPLY: "MOCKUP_MARKUP_APPLY",
      MOCKUP_MARKUP_CREATE_TEXT: "MOCKUP_MARKUP_CREATE_TEXT",
      MOCKUP_MARKUP_GET_COLOR_PREVIEWS: "MOCKUP_MARKUP_GET_COLOR_PREVIEWS"
    };
    MAIN_TO_UI = {
      BOOTSTRAPPED: "BOOTSTRAPPED",
      VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
      VARIABLE_CHAINS_RESULT_V2: "VARIABLE_CHAINS_RESULT_V2",
      SELECTION_EMPTY: "SELECTION_EMPTY",
      PRINT_COLOR_USAGES_SETTINGS: "PRINT_COLOR_USAGES_SETTINGS",
      PRINT_COLOR_USAGES_SELECTION: "PRINT_COLOR_USAGES_SELECTION",
      PRINT_COLOR_USAGES_STATUS: "PRINT_COLOR_USAGES_STATUS",
      MOCKUP_MARKUP_STATE: "MOCKUP_MARKUP_STATE",
      MOCKUP_MARKUP_STATUS: "MOCKUP_MARKUP_STATUS",
      MOCKUP_MARKUP_COLOR_PREVIEWS: "MOCKUP_MARKUP_COLOR_PREVIEWS",
      ERROR: "ERROR"
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
  for (const root of roots) {
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
  results.sort((a, b) => a.name.localeCompare(b.name));
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
    try {
      if (msg.type === UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS) {
        await sendUpdate();
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

// src/app/tools/mockup-markup/resolve.ts
function leafName(name) {
  const idx = (name != null ? name : "").lastIndexOf("/");
  return idx >= 0 ? name.slice(idx + 1) || name : name;
}
function namesMatch(candidate, wanted) {
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
async function resolveLocalTextStyleIdByNameRegex(regex) {
  var _a;
  try {
    const styles = await figma.getLocalTextStylesAsync();
    const match = styles.find((s) => {
      var _a2;
      return regex.test((_a2 = s.name) != null ? _a2 : "");
    });
    return (_a = match == null ? void 0 : match.id) != null ? _a : null;
  } catch (e) {
    return null;
  }
}
async function resolveTextStyleIdForPreset(preset) {
  var _a, _b;
  const preferred = TEXT_STYLE_ID_BY_PRESET[preset];
  try {
    const style = await figma.getStyleByIdAsync(preferred);
    const name = style == null ? void 0 : style.name;
    const type = style == null ? void 0 : style.type;
    if (style && type === "TEXT") {
      const n = (name != null ? name : "").toLowerCase();
      if (preset === "description" && n.includes("h3")) {
        return (_a = await resolveLocalTextStyleIdByNameRegex(/description/i)) != null ? _a : preferred;
      }
      if (preset === "h3" && n.includes("description")) {
        return (_b = await resolveLocalTextStyleIdByNameRegex(/\bh3\b/i)) != null ? _b : preferred;
      }
      return preferred;
    }
  } catch (e) {
  }
  const byName = preset === "h1" ? await resolveLocalTextStyleIdByNameRegex(/\bh1\b/i) : preset === "h2" ? await resolveLocalTextStyleIdByNameRegex(/\bh2\b/i) : preset === "h3" ? await resolveLocalTextStyleIdByNameRegex(/\bh3\b/i) : preset === "description" ? await resolveLocalTextStyleIdByNameRegex(/description/i) : await resolveLocalTextStyleIdByNameRegex(/paragraph|body/i);
  return byName != null ? byName : preferred;
}
async function loadFontForTextStyleId(textStyleId) {
  try {
    const style = await figma.getStyleByIdAsync(textStyleId);
    if (style && style.type === "TEXT") {
      const fontName = style.fontName;
      if (fontName) await figma.loadFontAsync(fontName);
    }
  } catch (e) {
  }
}
function makeSolidPaintBoundToColorVariable(variableId) {
  const paint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 };
  paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: variableId } };
  return paint;
}
function normalizeVariableId(raw) {
  const trimmed = (raw != null ? raw : "").trim();
  if (!trimmed) return "";
  const slashIdx = trimmed.indexOf("/");
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim();
}
async function resolveColorVariableId(rawId, fallbackNames) {
  const normalized = normalizeVariableId(rawId);
  if (normalized) {
    try {
      const v = await figma.variables.getVariableByIdAsync(normalized);
      if (v == null ? void 0 : v.id) return v.id;
    } catch (e) {
    }
  }
  const importedId = await resolveColorVariableIdByNameFromEnabledLibraries(fallbackNames);
  if (!importedId) {
    console.log("[Mockup Markup] Color variable not found", {
      rawId,
      normalizedId: normalized || null,
      fallbackNames,
      note: "Enable the Mockup markup library OR import the variable into this file."
    });
  }
  return importedId;
}
async function resolveColorVariableIdByNameFromEnabledLibraries(variableNameCandidates) {
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR");
    for (const wanted of variableNameCandidates) {
      const match = locals.find((v) => {
        var _a;
        return namesMatch((_a = v.name) != null ? _a : "", wanted);
      });
      if (match == null ? void 0 : match.id) return match.id;
    }
  } catch (e) {
  }
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const preferred = collections.filter((c) => libraryNameMatches(c.libraryName, MOCKUP_MARKUP_LIBRARY_NAME));
    const rest = collections.filter((c) => !libraryNameMatches(c.libraryName, MOCKUP_MARKUP_LIBRARY_NAME));
    const ordered = preferred.length > 0 ? [...preferred, ...rest] : collections;
    for (const c of ordered) {
      try {
        const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key);
        for (const wanted of variableNameCandidates) {
          const libMatch = vars.find(
            (v) => {
              var _a;
              return v.resolvedType === "COLOR" && namesMatch((_a = v.name) != null ? _a : "", wanted);
            }
          );
          if (libMatch == null ? void 0 : libMatch.key) {
            const imported = await figma.variables.importVariableByKeyAsync(libMatch.key);
            if (imported == null ? void 0 : imported.id) return imported.id;
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
  const fallbackNames = getColorVariableNameCandidates(preset);
  const id = await resolveColorVariableId(rawId, fallbackNames.length > 0 ? fallbackNames : ["Unknown"]);
  if (!id) {
    console.log("[Mockup Markup] Failed to resolve color preset", { preset, rawId, fallbackNames });
  }
  return id;
}
async function setExplicitModeForColorVariableCollection(variableId, modeName) {
  var _a, _b;
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    const collectionId = variable == null ? void 0 : variable.variableCollectionId;
    if (!collectionId) return;
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
    if (!collection) return;
    const wanted = modeName === "dark" ? "dark" : modeName;
    const modes = Array.isArray(collection.modes) ? collection.modes : [];
    const match = modes.find((m) => {
      var _a2;
      return ((_a2 = m.name) != null ? _a2 : "").trim().toLowerCase() === wanted;
    });
    const modeId = (_b = (_a = match == null ? void 0 : match.modeId) != null ? _a : collection.defaultModeId) != null ? _b : null;
    if (!modeId) return;
    figma.currentPage.setExplicitVariableModeForCollection(collection, modeId);
  } catch (e) {
    console.log("[Mockup Markup] Failed to set explicit variable mode", { variableId, modeName });
  }
}
var init_resolve = __esm({
  "src/app/tools/mockup-markup/resolve.ts"() {
    "use strict";
    init_presets();
  }
});

// src/app/tools/mockup-markup/apply.ts
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
async function applyMockupMarkupToSelection(request) {
  var _a;
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Select a text layer (or a frame with text) first");
    return { applied: 0, skipped: 0 };
  }
  const textNodes = collectTextNodesRecursivelyFromSelection(selection);
  if (textNodes.length === 0) {
    figma.notify("No text layers found in selection");
    return { applied: 0, skipped: 0 };
  }
  const styleId = await resolveTextStyleIdForPreset(request.presetTypography);
  await loadFontForTextStyleId(styleId);
  const colorVariableId = await resolveColorVariableForPreset(request.presetColor);
  const fills = colorVariableId ? [makeSolidPaintBoundToColorVariable(colorVariableId)] : null;
  if (request.forceModeName === "dark" && colorVariableId) {
    await setExplicitModeForColorVariableCollection(colorVariableId, "dark");
  }
  if (!fills) {
    console.log("[Mockup Markup] Apply: color preset not applied", { presetColor: request.presetColor });
  }
  let applied = 0;
  let skipped = 0;
  const changed = [];
  for (let idx = 0; idx < textNodes.length; idx++) {
    const text = textNodes[idx];
    try {
      await text.setTextStyleIdAsync(styleId);
      const len = ((_a = text.characters) != null ? _a : "").length;
      if (len > 0) await text.setRangeTextStyleIdAsync(0, len, styleId);
      if (request.width400) {
        try {
          ;
          text.textAutoResize = "HEIGHT";
          text.resize(400, text.height);
        } catch (e) {
        }
      }
      if (fills) text.fills = fills;
      applied++;
      changed.push(text);
    } catch (e) {
      skipped++;
    }
  }
  if (applied > 0) {
    figma.currentPage.selection = changed;
    try {
      figma.viewport.scrollAndZoomIntoView([changed[0]]);
    } catch (e) {
    }
  }
  figma.notify(
    applied > 0 ? `Applied markup to ${applied} text layer(s)${skipped ? `, skipped ${skipped}` : ""}` : skipped ? `Nothing applied (skipped ${skipped})` : "Nothing applied"
  );
  return { applied, skipped };
}
var init_apply = __esm({
  "src/app/tools/mockup-markup/apply.ts"() {
    "use strict";
    init_resolve();
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
async function resolveModeIdForVariable(variableId, forceModeName) {
  var _a, _b, _c, _d, _e;
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    const collectionId = variable == null ? void 0 : variable.variableCollectionId;
    if (!collectionId) return null;
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
    if (!collection) return null;
    if (forceModeName === "dark") {
      const match = ((_a = collection.modes) != null ? _a : []).find((m) => {
        var _a2;
        return ((_a2 = m.name) != null ? _a2 : "").trim().toLowerCase() === "dark";
      });
      if (match == null ? void 0 : match.modeId) return match.modeId;
    }
    const explicit = (_b = figma.currentPage.explicitVariableModes) == null ? void 0 : _b[collectionId];
    if (typeof explicit === "string" && explicit) return explicit;
    const defaultModeId = collection.defaultModeId;
    if (defaultModeId) return defaultModeId;
    return (_e = (_d = ((_c = collection.modes) != null ? _c : [])[0]) == null ? void 0 : _d.modeId) != null ? _e : null;
  } catch (e) {
    return null;
  }
}
async function resolveColorPreviewFromVariableId(variableId, forceModeName) {
  var _a;
  const seen = /* @__PURE__ */ new Set();
  let currentId = variableId;
  for (let steps = 0; steps < 10; steps++) {
    if (!currentId) break;
    if (seen.has(currentId)) break;
    seen.add(currentId);
    try {
      const variable = await figma.variables.getVariableByIdAsync(currentId);
      if (!variable) break;
      const modeId = await resolveModeIdForVariable(currentId, forceModeName);
      const valuesByMode = variable.valuesByMode;
      const value = modeId && valuesByMode ? valuesByMode[modeId] : void 0;
      if (value && typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS") {
        currentId = (_a = value.id) != null ? _a : null;
        continue;
      }
      if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
        const rgb = value;
        const hex = rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b });
        const a = typeof rgb.a === "number" ? clamp012(rgb.a) : 1;
        const opacityPercent = Math.round(a * 100);
        return { hex, opacityPercent };
      }
    } catch (e) {
      break;
    }
  }
  return { hex: null, opacityPercent: null };
}
async function getMockupMarkupColorPreviews(forceModeName) {
  const textId = await resolveColorVariableForPreset("text");
  const textSecondaryId = await resolveColorVariableForPreset("text-secondary");
  const purpleId = await resolveColorVariableForPreset("purple");
  const [text, textSecondary, purple] = await Promise.all([
    textId ? resolveColorPreviewFromVariableId(textId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
    textSecondaryId ? resolveColorPreviewFromVariableId(textSecondaryId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
    purpleId ? resolveColorPreviewFromVariableId(purpleId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null })
  ]);
  return { text, textSecondary, purple };
}
var init_color_previews = __esm({
  "src/app/tools/mockup-markup/color-previews.ts"() {
    "use strict";
    init_resolve();
  }
});

// src/app/tools/mockup-markup/create.ts
async function createMockupMarkupText(request) {
  var _a;
  const text = figma.createText();
  const center = figma.viewport.center;
  text.x = center.x;
  text.y = center.y;
  const styleId = await resolveTextStyleIdForPreset(request.presetTypography);
  await loadFontForTextStyleId(styleId);
  try {
    await text.setTextStyleIdAsync(styleId);
  } catch (e) {
  }
  try {
    text.characters = "Text";
    const len = ((_a = text.characters) != null ? _a : "").length;
    if (len > 0) {
      try {
        await text.setRangeTextStyleIdAsync(0, len, styleId);
      } catch (e) {
      }
    }
  } catch (e) {
  }
  if (request.width400) {
    try {
      ;
      text.textAutoResize = "HEIGHT";
      text.resize(400, text.height);
    } catch (e) {
    }
  }
  const variableId = await resolveColorVariableForPreset(request.presetColor);
  if (variableId) {
    if (request.forceModeName === "dark") {
      await setExplicitModeForColorVariableCollection(variableId, "dark");
    }
    text.fills = [makeSolidPaintBoundToColorVariable(variableId)];
  } else {
    console.log("[Mockup Markup] Create text: color preset not applied", { presetColor: request.presetColor });
  }
  figma.currentPage.selection = [text];
  figma.viewport.scrollAndZoomIntoView([text]);
  return text;
}
var init_create = __esm({
  "src/app/tools/mockup-markup/create.ts"() {
    "use strict";
    init_resolve();
  }
});

// src/app/tools/mockup-markup/import-once.ts
async function importMockupMarkupVariablesOnce() {
  try {
    const already = await figma.clientStorage.getAsync(IMPORT_ONCE_KEY);
    if (already === true) return;
  } catch (e) {
  }
  await Promise.all([
    resolveColorVariableForPreset("text"),
    resolveColorVariableForPreset("text-secondary"),
    resolveColorVariableForPreset("purple")
  ]);
  try {
    await figma.clientStorage.setAsync(IMPORT_ONCE_KEY, true);
  } catch (e) {
  }
}
var IMPORT_ONCE_KEY;
var init_import_once = __esm({
  "src/app/tools/mockup-markup/import-once.ts"() {
    "use strict";
    init_resolve();
    IMPORT_ONCE_KEY = "mockup-markup.imported-v1";
  }
});

// src/app/tools/mockup-markup/main-thread.ts
function collectTextNodesRecursivelyFromSelection2(selection) {
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
function getState() {
  const selection = figma.currentPage.selection;
  const textNodes = selection.length > 0 ? collectTextNodesRecursivelyFromSelection2(selection) : [];
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
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "working", message: "Preparing\u2026" } });
    await importMockupMarkupVariablesOnce();
    const previews = await getMockupMarkupColorPreviews("dark");
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews });
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } });
  };
  const onMessage = async (msg) => {
    try {
      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE) {
        await onActivate();
        return true;
      }
      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_APPLY) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
          status: { status: "working", message: "Applying\u2026" }
        });
        await applyMockupMarkupToSelection(msg.request);
        figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } });
        postState();
        return true;
      }
      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
          status: { status: "working", message: "Creating text\u2026" }
        });
        await createMockupMarkupText(msg.request);
        figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } });
        postState();
        return true;
      }
      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS) {
        const previews = await getMockupMarkupColorPreviews(msg.forceModeName);
        figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews });
        return true;
      }
    } catch (e) {
      try {
        figma.notify(e instanceof Error ? e.message : String(e));
      } catch (e2) {
      }
      figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } });
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
      textTheme: (saved == null ? void 0 : saved.textTheme) === "dark" || (saved == null ? void 0 : saved.textTheme) === "light" ? saved.textTheme : "dark"
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
      textTheme: "dark"
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
function leafName2(name) {
  const idx = (name != null ? name : "").lastIndexOf("/");
  return idx >= 0 ? name.slice(idx + 1) || name : name;
}
function namesMatch2(candidate, wanted) {
  const c = (candidate != null ? candidate : "").trim().toLowerCase();
  const w = (wanted != null ? wanted : "").trim().toLowerCase();
  if (!c || !w) return false;
  return c === w || leafName2(c) === w;
}
function libraryNameMatches2(candidate, wanted) {
  const c = (candidate != null ? candidate : "").trim().toLowerCase();
  const w = (wanted != null ? wanted : "").trim().toLowerCase();
  if (!c || !w) return false;
  return c === w;
}
async function resolveColorVariableId2(rawId, fallbackName) {
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
    const preferred = collections.filter((c) => libraryNameMatches2(c.libraryName, MARKUP_LIBRARY_NAME));
    const rest = collections.filter((c) => !libraryNameMatches2(c.libraryName, MARKUP_LIBRARY_NAME));
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
async function resolveMarkupTextFills(themeColors) {
  const fallbackPrimary = [makeSolidPaint(themeColors.primary, 1)];
  const fallbackSecondary = [makeSolidPaint(themeColors.secondary, 0.5)];
  let primary = fallbackPrimary;
  let secondary = fallbackSecondary;
  const resolvedPrimary = await resolveColorVariableId2(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW, MARKUP_TEXT_VARIABLE_NAME);
  if (resolvedPrimary == null ? void 0 : resolvedPrimary.id) {
    const paint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 };
    paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: resolvedPrimary.id } };
    primary = [paint];
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
  const resolvedSecondary = await resolveColorVariableId2(
    MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
    MARKUP_TEXT_SECONDARY_VARIABLE_NAME
  );
  if (resolvedSecondary == null ? void 0 : resolvedSecondary.id) {
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
  return { primary, secondary };
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
var PLUGIN_DATA_VARIABLE_ID, PLUGIN_DATA_VARIABLE_COLLECTION_ID, PLUGIN_DATA_VARIABLE_MODE_ID, variableCollectionCache;
var init_shared = __esm({
  "src/app/tools/print-color-usages/shared.ts"() {
    "use strict";
    PLUGIN_DATA_VARIABLE_ID = "pcu_variableId";
    PLUGIN_DATA_VARIABLE_COLLECTION_ID = "pcu_variableCollectionId";
    PLUGIN_DATA_VARIABLE_MODE_ID = "pcu_variableModeId";
    variableCollectionCache = /* @__PURE__ */ new Map();
  }
});

// src/app/tools/print-color-usages/analyze.ts
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
  if (!showLinkedColors) return { primaryText, secondaryText: "", modeContext };
  let secondaryText = "";
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
    const alpha = typeof value.a === "number" ? value.a : void 0;
    const valueOpacity = alpha === void 0 ? 1 : alpha;
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
    if (alpha !== void 0 && alpha !== 1) {
      secondaryText += ` ${Math.round(alpha * 100)}%`;
    }
  }
  return { primaryText, secondaryText, modeContext };
}
async function getColorUsage(paint, showLinkedColors = true, node, hideFolderNames = false) {
  const boundVariableId = getBoundColorVariableIdFromPaint(paint);
  if (boundVariableId) {
    const parts = await resolveVariableLabelPartsFromVariable(boundVariableId, showLinkedColors, node, hideFolderNames);
    const primaryText = parts.primaryText;
    const secondaryText = parts.secondaryText;
    if (showLinkedColors && secondaryText && paint.type === "SOLID") {
      const separator = "   ";
      let opacitySuffix = "";
      if (paint.opacity !== void 0 && paint.opacity !== 1) {
        opacitySuffix = ` ${Math.round(paint.opacity * 100)}%`;
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
async function analyzeNodeColors(node, showLinkedColors = true, hideFolderNames = false) {
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
  if ("children" in node) {
    const isUnion = node.type === "BOOLEAN_OPERATION" && node.booleanOperation === "UNION";
    if (!isUnion) {
      const children = node;
      for (const child of children.children) {
        const childColors = await analyzeNodeColors(child, showLinkedColors, hideFolderNames);
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
function calculateTextPositionFromRect(rect, position, index) {
  const spacing = 16;
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
      const colors = await analyzeNodeColors(n, showLinkedColors, hideFolderNames);
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
    const parentContainer = (_b = findContainingFrame(anchor)) != null ? _b : figma.currentPage;
    const nodeRect = getNodeRectInContainer(anchor, parentContainer);
    if (colorInfo.length === 0) {
      const text = figma.createText();
      text.characters = `No colors found in ${anchor.name}`;
      await applyTypographyToLabel(text, markupDescriptionStyle);
      const position = calculateTextPositionFromRect(nodeRect, textPosition, 0);
      text.x = position.x;
      text.y = position.y;
      text.fills = primaryFills;
      if (textPosition === "left") text.x = nodeRect.x - text.width - 16;
      parentContainer.appendChild(text);
      textNodes.push(text);
      continue;
    }
    for (let i = 0; i < colorInfo.length; i++) {
      const info = colorInfo[i];
      const text = figma.createText();
      text.characters = info.label;
      await applyTypographyToLabel(text, markupDescriptionStyle);
      const ctx = info.variableContext;
      if (ctx) {
        text.name = ctx.isNonDefaultMode && ctx.variableModeName ? `${ctx.variableId} (${ctx.variableModeName})` : ctx.variableId;
        text.setPluginData("pcu_variableId", ctx.variableId);
        if (ctx.isNonDefaultMode && ctx.variableCollectionId && ctx.variableModeId) {
          text.setPluginData("pcu_variableCollectionId", ctx.variableCollectionId);
          text.setPluginData("pcu_variableModeId", ctx.variableModeId);
        } else {
          text.setPluginData("pcu_variableCollectionId", "");
          text.setPluginData("pcu_variableModeId", "");
        }
      } else {
        text.name = info.layerName;
        text.setPluginData("pcu_variableId", "");
        text.setPluginData("pcu_variableCollectionId", "");
        text.setPluginData("pcu_variableModeId", "");
      }
      const position = calculateTextPositionFromRect(nodeRect, textPosition, i);
      text.x = position.x;
      text.y = position.y;
      text.fills = primaryFills;
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
    figma.notify(`Created ${textNodes.length} color usage text node(s)`);
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
async function resolveVariableLabelPartsFromVariable2(variableId, showLinkedColors, node, hideFolderNames, explicitModeId) {
  var _a, _b;
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  const maybeStripFolderPrefix2 = (name) => {
    if (!hideFolderNames) return name;
    const idx = name.lastIndexOf("/");
    if (idx === -1) return name;
    const leaf = name.slice(idx + 1);
    return leaf || name;
  };
  const primaryText = maybeStripFolderPrefix2((_b = (_a = variable == null ? void 0 : variable.name) != null ? _a : variable == null ? void 0 : variable.key) != null ? _b : "Unknown Variable");
  const modeContext = await resolveVariableModeContext(
    variable == null ? void 0 : variable.variableCollectionId,
    node,
    variable == null ? void 0 : variable.valuesByMode,
    explicitModeId
  );
  if (!showLinkedColors) return { primaryText, secondaryText: "", modeContext };
  let secondaryText = "";
  const currentModeId = modeContext.modeId;
  const value = currentModeId && (variable == null ? void 0 : variable.valuesByMode) ? variable.valuesByMode[currentModeId] : void 0;
  if (value && typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS") {
    const aliasValue = value;
    if (aliasValue.id) {
      try {
        const linkedVariable = await figma.variables.getVariableByIdAsync(aliasValue.id);
        if (linkedVariable == null ? void 0 : linkedVariable.name) secondaryText = maybeStripFolderPrefix2(linkedVariable.name);
      } catch (e) {
      }
    }
  }
  return { primaryText, secondaryText, modeContext };
}
function collectTextNodesRecursivelyFromSelection3(selection) {
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
async function updateSelectedTextNodesByVariableId(settings) {
  var _a, _b, _c, _d, _e;
  await savePrintColorUsagesSettings(settings);
  const selection = figma.currentPage.selection;
  const hasSelection = selection.length > 0;
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
  const textNodes = hasSelection ? collectTextNodesRecursivelyFromSelection3(selection) : figma.currentPage.findAll((n) => n.type === "TEXT").map((n) => n).filter((t) => {
    var _a2;
    return ((_a2 = t.name) != null ? _a2 : "").trim().startsWith("VariableID");
  });
  if (hasSelection && textNodes.length === 0) {
    figma.notify("No text layers selected");
    return { updated: 0, unchanged: 0, skipped: 0 };
  }
  if (!hasSelection && textNodes.length === 0) {
    figma.notify('No text layers found on this page with name starting "VariableID"');
    return { updated: 0, unchanged: 0, skipped: 0 };
  }
  let updated = 0;
  let skipped = 0;
  let unchanged = 0;
  const changedNodes = [];
  const total = textNodes.length;
  for (let idx = 0; idx < textNodes.length; idx++) {
    const text = textNodes[idx];
    const currentLayerName = ((_a = text.name) != null ? _a : "").trim();
    if (!currentLayerName) {
      skipped++;
      continue;
    }
    let variableIdToUse = null;
    let variableCollectionId = null;
    const variableIdFromPluginData = (() => {
      try {
        const v = text.getPluginData(PLUGIN_DATA_VARIABLE_ID);
        return v ? v.trim() : "";
      } catch (e) {
        return "";
      }
    })();
    const variableIdFromLayerName = extractVariableIdFromLayerName(currentLayerName);
    const idCandidate = variableIdFromPluginData || variableIdFromLayerName || "";
    try {
      const v = await figma.variables.getVariableByIdAsync(idCandidate || currentLayerName);
      if (v == null ? void 0 : v.id) {
        variableIdToUse = v.id;
        variableCollectionId = (_b = v == null ? void 0 : v.variableCollectionId) != null ? _b : null;
      }
    } catch (e) {
    }
    if (!variableIdToUse) {
      variableIdToUse = await findLocalVariableIdByName(stripTrailingModeSuffix(currentLayerName));
      if (variableIdToUse) {
        try {
          const v = await figma.variables.getVariableByIdAsync(variableIdToUse);
          variableCollectionId = (_c = v == null ? void 0 : v.variableCollectionId) != null ? _c : null;
        } catch (e) {
        }
      }
    }
    if (!variableIdToUse) {
      skipped++;
      continue;
    }
    let explicitModeId = (() => {
      try {
        const fromData = text.getPluginData(PLUGIN_DATA_VARIABLE_MODE_ID);
        return fromData ? fromData : null;
      } catch (e) {
        return null;
      }
    })();
    if (!explicitModeId && variableCollectionId) {
      const modeName = extractModeNameFromLayerName(currentLayerName);
      if (modeName) explicitModeId = await resolveModeIdByName(variableCollectionId, modeName);
    }
    let parts;
    try {
      parts = await resolveVariableLabelPartsFromVariable2(
        variableIdToUse,
        settings.showLinkedColors,
        text,
        settings.hideFolderNames,
        explicitModeId
      );
    } catch (e) {
      skipped++;
      continue;
    }
    const separator = "   ";
    const hasSecondary = settings.showLinkedColors && !!parts.secondaryText;
    const label = hasSecondary ? `${parts.primaryText}${separator}${parts.secondaryText}` : parts.primaryText;
    const desiredLayerName = parts.modeContext.isNonDefaultMode && parts.modeContext.modeName ? `${variableIdToUse} (${parts.modeContext.modeName})` : variableIdToUse;
    const needsCharactersUpdate = ((_d = text.characters) != null ? _d : "") !== label;
    const needsNameUpdate = ((_e = text.name) != null ? _e : "") !== desiredLayerName;
    if (!needsCharactersUpdate && !needsNameUpdate) {
      unchanged++;
      continue;
    }
    try {
      if (needsCharactersUpdate) text.characters = label;
    } catch (e) {
      skipped++;
      continue;
    }
    if (needsNameUpdate) text.name = desiredLayerName;
    try {
      await applyTypographyToLabel(text, markupDescriptionStyle);
    } catch (e) {
    }
    text.fills = primaryFills;
    if (hasSecondary) {
      const secondaryStart = parts.primaryText.length + separator.length;
      const secondaryEnd = secondaryStart + parts.secondaryText.length;
      try {
        text.setRangeFills(secondaryStart, secondaryEnd, Array.from(secondaryFills));
      } catch (e) {
      }
    }
    try {
      text.setPluginData(PLUGIN_DATA_VARIABLE_ID, variableIdToUse);
      if (parts.modeContext.isNonDefaultMode && parts.modeContext.variableCollectionId && parts.modeContext.modeId) {
        text.setPluginData(PLUGIN_DATA_VARIABLE_COLLECTION_ID, parts.modeContext.variableCollectionId);
        text.setPluginData(PLUGIN_DATA_VARIABLE_MODE_ID, parts.modeContext.modeId);
      } else {
        text.setPluginData(PLUGIN_DATA_VARIABLE_COLLECTION_ID, "");
        text.setPluginData(PLUGIN_DATA_VARIABLE_MODE_ID, "");
      }
    } catch (e) {
    }
    updated++;
    changedNodes.push(text);
  }
  const summaryMessage = updated > 0 ? `Updated ${updated} text layer(s)${unchanged ? `, unchanged ${unchanged}` : ""}${skipped ? `, skipped ${skipped}` : ""}${hasSelection ? "" : " (page scan)"}` : `No layers were updated${unchanged ? ` (${unchanged} unchanged)` : ""}${skipped ? `, skipped ${skipped}` : ""}${hasSelection ? "" : " (page scan)"}`;
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
  const postSelection = () => {
    if (getActiveTool() !== "print-color-usages-tool") return;
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION, selectionSize: figma.currentPage.selection.length });
  };
  figma.on("selectionchange", postSelection);
  const onActivate = async () => {
    postSelection();
    await postSettings();
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
  };
  const onMessage = async (msg) => {
    try {
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS) {
        await onActivate();
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS) {
        await savePrintColorUsagesSettings(__spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" }));
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT) {
        const settings = __spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" });
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Printing\u2026" }
        });
        await printColorUsagesFromSelection(settings);
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
        return true;
      }
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE) {
        const settings = __spreadProps(__spreadValues({}, msg.settings), { textTheme: "dark" });
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Updating\u2026" }
        });
        await updateSelectedTextNodesByVariableId(settings);
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } });
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
var init_main_thread3 = __esm({
  "src/app/tools/print-color-usages/main-thread.ts"() {
    "use strict";
    init_messages();
    init_settings();
    init_print();
    init_update();
  }
});

// src/app/run.ts
function run(command) {
  showUI(
    {
      width: 360,
      height: 500,
      title: command === "color-chain-tool" ? "View Colors Chain" : command === "print-color-usages-tool" ? "Print Color Usages" : command === "mockup-markup-tool" ? "Mockup markup quick apply" : "JetBrains Design Tools"
    },
    { command }
  );
  let activeTool = command === "color-chain-tool" || command === "print-color-usages-tool" || command === "mockup-markup-tool" ? command : "home";
  const getActiveTool = () => activeTool;
  const colorChain = registerColorChainTool(getActiveTool);
  const printColorUsages = registerPrintColorUsagesTool(getActiveTool);
  const mockupMarkup = registerMockupMarkupTool(getActiveTool);
  const activate = async (tool) => {
    activeTool = tool;
    if (tool === "color-chain-tool") {
      colorChain.onActivate();
      return;
    }
    if (tool === "print-color-usages-tool") {
      await printColorUsages.onActivate();
      return;
    }
    if (tool === "mockup-markup-tool") {
      mockupMarkup.onActivate();
      return;
    }
  };
  figma.ui.onmessage = async (msg) => {
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

// src/color-chain-tool/main.ts
var main_exports2 = {};
__export(main_exports2, {
  default: () => main_default2
});
function main_default2() {
  run("color-chain-tool");
}
var init_main2 = __esm({
  "src/color-chain-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/print-color-usages-tool/main.ts
var main_exports3 = {};
__export(main_exports3, {
  default: () => main_default3
});
function main_default3() {
  run("print-color-usages-tool");
}
var init_main3 = __esm({
  "src/print-color-usages-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// src/mockup-markup-tool/main.ts
var main_exports4 = {};
__export(main_exports4, {
  default: () => main_default4
});
function main_default4() {
  run("mockup-markup-tool");
}
var init_main4 = __esm({
  "src/mockup-markup-tool/main.ts"() {
    "use strict";
    init_run();
  }
});

// <stdin>
var modules = { "src/home/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"], "src/color-chain-tool/main.ts--default": (init_main2(), __toCommonJS(main_exports2))["default"], "src/print-color-usages-tool/main.ts--default": (init_main3(), __toCommonJS(main_exports3))["default"], "src/mockup-markup-tool/main.ts--default": (init_main4(), __toCommonJS(main_exports4))["default"] };
var commandId = typeof figma.command === "undefined" || figma.command === "" || figma.command === "generate" ? "src/home/main.ts--default" : figma.command;
modules[commandId]();
