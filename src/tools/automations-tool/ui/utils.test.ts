import { describe, it, expect } from "vitest"
import type { AutomationStepPayload } from "../../../home/messages"
import { pathRoot, pathExtend, removeStepAtPath, moveStepAtPath, getStepsInExecutionOrder } from "./utils"

function step(id: string, actionType: string, children?: AutomationStepPayload[], elseChildren?: AutomationStepPayload[]): AutomationStepPayload {
  const s: AutomationStepPayload = { id, actionType, params: {}, enabled: true }
  if (children?.length) s.children = children
  if (elseChildren?.length) s.elseChildren = elseChildren
  return s
}

describe("removeStepAtPath", () => {
  it("removes root-level step at index 0", () => {
    const steps = [step("a", "sourceFromSelection"), step("b", "filter"), step("c", "notify")]
    const result = removeStepAtPath(steps, pathRoot(0))
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("b")
    expect(result[1].id).toBe("c")
  })

  it("removes root-level step at middle index", () => {
    const steps = [step("a", "x"), step("b", "y"), step("c", "z")]
    const result = removeStepAtPath(steps, pathRoot(1))
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("a")
    expect(result[1].id).toBe("c")
  })

  it("removes root-level step at last index", () => {
    const steps = [step("a", "x"), step("b", "y")]
    const result = removeStepAtPath(steps, pathRoot(1))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("a")
  })

  it("removes child step inside repeat", () => {
    const child = step("child", "setCharacters")
    const root = step("repeat", "repeatWithEach", [child])
    const steps = [root]
    const result = removeStepAtPath(steps, pathExtend(pathRoot(0), 0, "then"))
    expect(result).toHaveLength(1)
    expect(result[0].children ?? []).toHaveLength(0)
  })

  it("returns steps unchanged for empty path", () => {
    const steps = [step("a", "x")]
    const result = removeStepAtPath(steps, [])
    expect(result).toBe(steps)
    expect(result).toHaveLength(1)
  })
})

describe("moveStepAtPath", () => {
  it("moves root step up (index 1 -> 0)", () => {
    const steps = [step("a", "x"), step("b", "y"), step("c", "z")]
    const result = moveStepAtPath(steps, pathRoot(1), -1)
    expect(result).toHaveLength(3)
    expect(result[0].id).toBe("b")
    expect(result[1].id).toBe("a")
    expect(result[2].id).toBe("c")
  })

  it("moves root step down (index 0 -> 1)", () => {
    const steps = [step("a", "x"), step("b", "y"), step("c", "z")]
    const result = moveStepAtPath(steps, pathRoot(0), 1)
    expect(result).toHaveLength(3)
    expect(result[0].id).toBe("b")
    expect(result[1].id).toBe("a")
    expect(result[2].id).toBe("c")
  })

  it("returns steps unchanged when moving first root step up (out of bounds)", () => {
    const steps = [step("a", "x"), step("b", "y")]
    const result = moveStepAtPath(steps, pathRoot(0), -1)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("a")
    expect(result[1].id).toBe("b")
  })

  it("returns steps unchanged when moving last root step down (out of bounds)", () => {
    const steps = [step("a", "x"), step("b", "y")]
    const result = moveStepAtPath(steps, pathRoot(1), 1)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("a")
    expect(result[1].id).toBe("b")
  })

  it("moves child step within repeat block", () => {
    const c0 = step("c0", "log")
    const c1 = step("c1", "setCharacters")
    const root = step("repeat", "repeatWithEach", [c0, c1])
    const steps = [root]
    const result = moveStepAtPath(steps, pathExtend(pathRoot(0), 1, "then"), -1)
    expect(result[0].children).toHaveLength(2)
    expect(result[0].children![0].id).toBe("c1")
    expect(result[0].children![1].id).toBe("c0")
  })

  it("returns steps unchanged for empty path", () => {
    const steps = [step("a", "x")]
    const result = moveStepAtPath(steps, [], 1)
    expect(result).toBe(steps)
    expect(result).toHaveLength(1)
  })
})

describe("getStepsInExecutionOrder", () => {
  it("returns root steps in order", () => {
    const steps = [step("a", "x"), step("b", "y")]
    const result = getStepsInExecutionOrder(steps)
    expect(result).toHaveLength(2)
    expect(result[0].step.id).toBe("a")
    expect(result[0].path).toEqual([{ rootIndex: 0 }])
    expect(result[1].step.id).toBe("b")
    expect(result[1].path).toEqual([{ rootIndex: 1 }])
  })

  it("includes steps inside Repeat before following root steps", () => {
    const inner = step("inner", "setCharacters")
    const root0 = step("r0", "sourceFromSelection")
    const repeat = step("repeat", "repeatWithEach", [inner])
    const root2 = step("r2", "notify")
    const steps = [root0, repeat, root2]
    const result = getStepsInExecutionOrder(steps)
    expect(result.map((o) => o.step.id)).toEqual(["r0", "repeat", "inner", "r2"])
    expect(result[2].path).toEqual([{ rootIndex: 1 }, { childIndex: 0, childBranch: "then" }])
  })
})
