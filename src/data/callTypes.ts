export interface CallType {
  id: string;
  name: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  color: string;
  icon: string;
}

export const callTypes: CallType[] = [
  {
    id: 'personal-foul',
    name: 'Personal Foul',
    description: 'Illegal contact between players',
    severity: 'moderate',
    color: 'yellow',
    icon: 'hand'
  },
  {
    id: 'technical-foul',
    name: 'Technical Foul',
    description: 'Unsportsmanlike conduct or violation',
    severity: 'major',
    color: 'red',
    icon: 'alert-triangle'
  },
  {
    id: 'flagrant-foul',
    name: 'Flagrant Foul',
    description: 'Excessive or unnecessary contact',
    severity: 'major',
    color: 'red',
    icon: 'zap'
  },
  {
    id: 'offensive-foul',
    name: 'Offensive Foul',
    description: 'Illegal contact by offensive player',
    severity: 'moderate',
    color: 'orange',
    icon: 'shield'
  },
  {
    id: 'blocking-foul',
    name: 'Blocking Foul',
    description: 'Illegal defensive positioning',
    severity: 'minor',
    color: 'blue',
    icon: 'square'
  },
  {
    id: 'charging-foul',
    name: 'Charging Foul',
    description: 'Offensive player runs into defender',
    severity: 'moderate',
    color: 'purple',
    icon: 'move'
  },
  {
    id: 'traveling',
    name: 'Traveling',
    description: 'Moving without dribbling the ball',
    severity: 'minor',
    color: 'green',
    icon: 'footprints'
  },
  {
    id: 'double-dribble',
    name: 'Double Dribble',
    description: 'Dribbling after stopping or using both hands',
    severity: 'minor',
    color: 'green',
    icon: 'repeat'
  }
];

export const getCallTypeById = (id: string): CallType | undefined => {
  return callTypes.find(type => type.id === id);
};

export const getCallTypeColor = (severity: string): string => {
  switch (severity) {
    case 'minor': return 'text-green-400 bg-green-500';
    case 'moderate': return 'text-yellow-400 bg-yellow-500';
    case 'major': return 'text-red-400 bg-red-500';
    default: return 'text-gray-400 bg-gray-500';
  }
};