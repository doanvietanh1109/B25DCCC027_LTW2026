import { MILESTONES, PRIZES } from './data';

// reason: 'win' | 'wrong' | 'timeout' | 'quit' (quyền dừng ở Bài 3).
export const calcPrize = (correctCount, reason) => {
  if (correctCount <= 0) return 0;
  if (reason === 'win' || reason === 'quit') {
    return PRIZES[correctCount - 1];
  }
  const passedMilestones = MILESTONES.filter((milestone) => milestone <= correctCount);
  const lastMilestone = passedMilestones[passedMilestones.length - 1];
  return lastMilestone ? PRIZES[lastMilestone - 1] : 0;
};
