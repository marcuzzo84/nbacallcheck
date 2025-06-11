import { CallData } from '../lib/supabase';

export const mockCallsData: CallData[] = [
  {
    id: "a1b2c3d4-e5f6-4789-9012-34567890abcd",
    type: "Personal Foul",
    description: "Defender bumps the ball handler with the body and halts his progress on the drive. Contact initiated by defender's hip check.",
    confidence: 73,
    timestamp: "Q2 8:47",
    game_id: "f1e2d3c4-b5a6-4987-8765-43210fedcba9",
    quarter: 2,
    time_remaining: "8:47",
    players: {
      fouler: "Aaron Wiggins",
      victim: "Zion Williamson"
    },
    referee: {
      name: "Scott Foster",
      accuracy: 87.3,
      totalCalls: 1247
    },
    created_at: new Date().toISOString()
  },
  {
    id: "b2c3d4e5-f6a7-4890-9123-456789abcdef",
    type: "Technical Foul",
    description: "Player argues excessively with referee after no-call on previous possession. Unsportsmanlike conduct.",
    confidence: 91,
    timestamp: "Q3 4:23",
    game_id: "f1e2d3c4-b5a6-4987-8765-43210fedcba9",
    quarter: 3,
    time_remaining: "4:23",
    players: {
      fouler: "Draymond Green",
      victim: "N/A"
    },
    referee: {
      name: "Tony Brothers",
      accuracy: 82.1,
      totalCalls: 892
    },
    created_at: new Date().toISOString()
  },
  {
    id: "c3d4e5f6-a7b8-4901-9234-56789abcdef0",
    type: "Flagrant Foul",
    description: "Excessive contact to the head and neck area during shooting motion. Unnecessary and excessive force applied.",
    confidence: 95,
    timestamp: "Q4 2:15",
    game_id: "f1e2d3c4-b5a6-4987-8765-43210fedcba9",
    quarter: 4,
    time_remaining: "2:15",
    players: {
      fouler: "Grayson Allen",
      victim: "Stephen Curry"
    },
    referee: {
      name: "Ed Malloy",
      accuracy: 89.7,
      totalCalls: 1156
    },
    created_at: new Date().toISOString()
  }
];

export const mockVotesData = {
  "a1b2c3d4-e5f6-4789-9012-34567890abcd": { correct: 156, incorrect: 89, unclear: 23 },
  "b2c3d4e5-f6a7-4890-9123-456789abcdef": { correct: 234, incorrect: 45, unclear: 12 },
  "c3d4e5f6-a7b8-4901-9234-56789abcdef0": { correct: 298, incorrect: 23, unclear: 8 }
};

export const mockPlayerStats = {
  "Aaron Wiggins": {
    foulsPerGame: 2.1,
    technicalFouls: 0,
    flagrantFouls: 0,
    foulsDrawnPerGame: 1.8,
    freeThrowAttempts: 2.3
  },
  "Zion Williamson": {
    foulsPerGame: 3.2,
    technicalFouls: 2,
    flagrantFouls: 0,
    foulsDrawnPerGame: 4.8,
    freeThrowAttempts: 7.2
  },
  "Draymond Green": {
    foulsPerGame: 4.1,
    technicalFouls: 12,
    flagrantFouls: 2,
    foulsDrawnPerGame: 2.1,
    freeThrowAttempts: 1.8
  },
  "Stephen Curry": {
    foulsPerGame: 1.9,
    technicalFouls: 1,
    flagrantFouls: 0,
    foulsDrawnPerGame: 3.2,
    freeThrowAttempts: 4.8
  },
  "Grayson Allen": {
    foulsPerGame: 2.8,
    technicalFouls: 3,
    flagrantFouls: 1,
    foulsDrawnPerGame: 1.5,
    freeThrowAttempts: 2.1
  }
};