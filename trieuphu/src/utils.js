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

// Phân bổ % cho A, B, C, D; đáp án ẩn bằng 0%, đáp án đúng luôn cao nhất.
export const generateAudienceVotes = (correctAnswer, hiddenIndexes = []) => {
  const percentages = [0, 0, 0, 0];
  const visibleWrong = [0, 1, 2, 3].filter(
    (index) => index !== correctAnswer && !hiddenIndexes.includes(index)
  );
  // Khi chỉ còn 1 đáp án sai (do 50:50), đáp án đúng phải hơn 50%.
  const minCorrect = visibleWrong.length === 1 ? 51 : 40;
  const correctPercent = minCorrect + Math.floor(Math.random() * (71 - minCorrect));
  percentages[correctAnswer] = correctPercent;
  let remaining = 100 - correctPercent;

  // Mỗi phiếu được phân ngẫu nhiên; không có đáp án sai nào vượt đáp án đúng.
  while (remaining > 0) {
    const eligible = visibleWrong.filter((index) => percentages[index] < correctPercent - 1);
    if (eligible.length === 0) break;
    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    percentages[chosen] += 1;
    remaining -= 1;
  }

  return percentages;
};
