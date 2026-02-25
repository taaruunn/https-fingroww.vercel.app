import { describe, expect, it } from "vitest";
import { applyBallEvent, createInitialInnings, undoLastBall } from "./engine";

describe("scoring engine", () => {
  it("counts legal balls and closes over on 6 legal deliveries", () => {
    let state = createInitialInnings("p1", "p2", "b1");

    for (let i = 0; i < 5; i += 1) {
      state = applyBallEvent(state, {
        strikerId: state.strikerId,
        nonStrikerId: state.nonStrikerId,
        bowlerId: "b1",
        runsOffBat: 0,
        extrasType: "NONE",
        extrasRuns: 0,
        wicketType: "NONE",
      });
    }

    expect(state.over).toBe(0);
    expect(state.ballInOver).toBe(5);

    state = applyBallEvent(state, {
      strikerId: state.strikerId,
      nonStrikerId: state.nonStrikerId,
      bowlerId: "b1",
      runsOffBat: 1,
      extrasType: "NONE",
      extrasRuns: 0,
      wicketType: "NONE",
    });

    expect(state.over).toBe(1);
    expect(state.ballInOver).toBe(0);
  });

  it("does not count wide as legal ball", () => {
    const state = applyBallEvent(createInitialInnings("p1", "p2", "b1"), {
      strikerId: "p1",
      nonStrikerId: "p2",
      bowlerId: "b1",
      runsOffBat: 0,
      extrasType: "WIDE",
      extrasRuns: 1,
      wicketType: "NONE",
    });

    expect(state.legalBalls).toBe(0);
    expect(state.totalRuns).toBe(1);
    expect(state.extras.WIDE).toBe(1);
  });

  it("records wicket in fall-of-wickets", () => {
    const state = applyBallEvent(createInitialInnings("p1", "p2", "b1"), {
      strikerId: "p1",
      nonStrikerId: "p2",
      bowlerId: "b1",
      runsOffBat: 0,
      extrasType: "NONE",
      extrasRuns: 0,
      wicketType: "BOWLED",
      wicketPlayerId: "p1",
    });

    expect(state.wickets).toBe(1);
    expect(state.fallOfWickets[0]).toEqual({ score: 0, wicketNumber: 1, playerId: "p1" });
  });

  it("recomputes state when undoing last ball", () => {
    const initial = createInitialInnings("p1", "p2", "b1");
    const history = [
      {
        strikerId: "p1",
        nonStrikerId: "p2",
        bowlerId: "b1",
        runsOffBat: 4,
        extrasType: "NONE" as const,
        extrasRuns: 0,
        wicketType: "NONE" as const,
      },
      {
        strikerId: "p1",
        nonStrikerId: "p2",
        bowlerId: "b1",
        runsOffBat: 0,
        extrasType: "WIDE" as const,
        extrasRuns: 1,
        wicketType: "NONE" as const,
      },
    ];

    const state = undoLastBall(initial, history);
    expect(state.totalRuns).toBe(4);
    expect(state.extras.WIDE).toBe(0);
  });
});
