export interface CallData {
  id: string;
  type: string;
  description: string;
  confidence: number;
  timestamp: string;
  players: {
    fouler: string;
    victim: string;
  };
  referee: {
    name: string;
    accuracy: number;
    totalCalls: number;
  };
  votes: {
    correct: number;
    incorrect: number;
    unclear: number;
  };
  playerStats: {
    fouler: {
      name: string;
      foulsPerGame: number;
      technicalFouls: number;
      flagrantFouls: number;
    };
    victim: {
      name: string;
      foulsDrawnPerGame: number;
      freeThrowAttempts: number;
    };
  };
}

export const mockCallData: CallData = {
  id: "call-2024-001",
  type: "Personal Foul",
  description: "Defender bumps the ball handler with the body and halts his progress on the drive.",
  confidence: 73,
  timestamp: "Q2 8:47",
  players: {
    fouler: "Aaron Wiggins",
    victim: "Zion Williamson"
  },
  referee: {
    name: "Scott Foster",
    accuracy: 87.3,
    totalCalls: 1247
  },
  votes: {
    correct: 156,
    incorrect: 89,
    unclear: 23
  },
  playerStats: {
    fouler: {
      name: "Aaron Wiggins",
      foulsPerGame: 2.1,
      technicalFouls: 0,
      flagrantFouls: 0
    },
    victim: {
      name: "Zion Williamson",
      foulsDrawnPerGame: 4.8,
      freeThrowAttempts: 7.2
    }
  }
};

export const getVotePercentages = (votes: CallData['votes']) => {
  const total = votes.correct + votes.incorrect + votes.unclear;
  return {
    correct: Math.round((votes.correct / total) * 100),
    incorrect: Math.round((votes.incorrect / total) * 100),
    unclear: Math.round((votes.unclear / total) * 100)
  };
};