const matchesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD': return [...action.payload];
    case 'ADD': {
      const id = state.reduce((max, match) => Math.max(max, match.id), 0) + 1;
      return [...state, { ...action.payload, id }];
    }
    case 'REMOVE': return state.filter((match) => match.id !== action.payload);
    case 'SET_GOALS': return state.map((match) => match.id === action.payload.id ? { ...match, homeGoals: action.payload.homeGoals, awayGoals: action.payload.awayGoals } : match);
    default: return state;
  }
};

export default matchesReducer;
