export type ExtraType = "NONE" | "WIDE" | "NO_BALL" | "BYE" | "LEG_BYE" | "PENALTY";
export type WicketType =
  | "NONE"
  | "BOWLED"
  | "CAUGHT"
  | "RUN_OUT"
  | "STUMPING"
  | "LBW"
  | "HIT_WICKET"
  | "RETIRED";

export interface BallEvent {
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  runsOffBat: number;
  extrasType: ExtraType;
  extrasRuns: number;
  wicketType: WicketType;
  wicketPlayerId?: string;
}

export interface InningState {
  totalRuns: number;
  wickets: number;
  legalBalls: number;
  over: number;
  ballInOver: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  extras: Record<ExtraType, number>;
  fallOfWickets: Array<{ score: number; wicketNumber: number; playerId?: string }>;
}

const isLegalBall = (ball: BallEvent) => ball.extrasType !== "WIDE" && ball.extrasType !== "NO_BALL";

const isCountedWicket = (ball: BallEvent) => ball.wicketType !== "NONE" && ball.wicketType !== "RETIRED";

export function createInitialInnings(strikerId: string, nonStrikerId: string, bowlerId: string): InningState {
  return {
    totalRuns: 0,
    wickets: 0,
    legalBalls: 0,
    over: 0,
    ballInOver: 0,
    strikerId,
    nonStrikerId,
    bowlerId,
    extras: {
      NONE: 0,
      WIDE: 0,
      NO_BALL: 0,
      BYE: 0,
      LEG_BYE: 0,
      PENALTY: 0,
    },
    fallOfWickets: [],
  };
}

export function applyBallEvent(state: InningState, ball: BallEvent): InningState {
  const next: InningState = {
    ...state,
    extras: { ...state.extras },
    fallOfWickets: [...state.fallOfWickets],
  };

  const deliveryRuns = ball.runsOffBat + ball.extrasRuns;

  next.totalRuns += deliveryRuns;
  next.extras[ball.extrasType] += ball.extrasRuns;

  if (isCountedWicket(ball)) {
    next.wickets += 1;
    next.fallOfWickets.push({
      score: next.totalRuns,
      wicketNumber: next.wickets,
      playerId: ball.wicketPlayerId,
    });
  }

  if (isLegalBall(ball)) {
    next.legalBalls += 1;
    next.over = Math.floor(next.legalBalls / 6);
    next.ballInOver = next.legalBalls % 6;
  }

  const oddRuns = deliveryRuns % 2 === 1;
  if (oddRuns) {
    const prevStriker = next.strikerId;
    next.strikerId = next.nonStrikerId;
    next.nonStrikerId = prevStriker;
  }

  if (next.ballInOver === 0 && isLegalBall(ball)) {
    const prevStriker = next.strikerId;
    next.strikerId = next.nonStrikerId;
    next.nonStrikerId = prevStriker;
  }

  next.bowlerId = ball.bowlerId;

  return next;
}

export function undoLastBall(initial: InningState, history: BallEvent[]): InningState {
  return history.slice(0, -1).reduce((acc, ball) => applyBallEvent(acc, ball), initial);
}
