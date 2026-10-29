import { MILESTONES, PRIZES } from './data';

// reason: 'win' | 'wrong' | 'timeout' | 'quit'.
export const calcPrize = (correctCount, reason) => {
  if (correctCount <= 0) return 0;
  if (reason === 'win' || reason === 'quit') return PRIZES[correctCount - 1];
  const passedMilestones = MILESTONES.filter((milestone) => milestone <= correctCount);
  const lastMilestone = passedMilestones[passedMilestones.length - 1];
  return lastMilestone ? PRIZES[lastMilestone - 1] : 0;
};

// Fisher-Yates trên bản sao để không sửa dữ liệu/state ban đầu.
export const shuffleArray = (items, random = Math.random) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Sau khi tráo options, tìm lại chỉ số của đáp án đúng theo vị trí GỐC.
export const shuffleQuestionOptions = (question, random = Math.random) => {
  const indexed = question.options.map((option, originalIndex) => ({ option, originalIndex }));
  const shuffled = shuffleArray(indexed, random);
  return {
    ...question,
    options: shuffled.map(({ option }) => option),
    answer: shuffled.findIndex(({ originalIndex }) => originalIndex === question.answer),
  };
};

// Mỗi ván lấy 5 câu dễ, 5 câu trung bình, 5 câu khó từ tối thiểu 10 câu/mức.
// Giữ thứ tự mức 1 -> 2 -> 3 để độ khó tăng dần, nhưng đảo câu trong mỗi mức.
export const createGameQuestions = (questionBank, random = Math.random) => {
  if (![1, 2, 3].every((level) => questionBank.filter((q) => q.level === level).length >= 5)) {
    return [];
  }
  return [1, 2, 3].flatMap((level) =>
    shuffleArray(questionBank.filter((q) => q.level === level), random)
      .slice(0, 5)
      .map((question) => shuffleQuestionOptions(question, random))
  );
};

// Phân bổ %: đáp án đúng 40–70%, tất cả cộng 100%; đáp án đã ẩn nhận 0%.
export const generateAudienceVotes = (correctAnswer, hiddenIndexes = [], random = Math.random) => {
  const percentages = [0, 0, 0, 0];
  const visibleWrong = [0, 1, 2, 3].filter(
    (index) => index !== correctAnswer && !hiddenIndexes.includes(index)
  );
  const minCorrect = visibleWrong.length === 1 ? 51 : 40;
  const correctPercent = minCorrect + Math.floor(random() * (71 - minCorrect));
  percentages[correctAnswer] = correctPercent;
  let remaining = 100 - correctPercent;

  while (remaining > 0) {
    const eligible = visibleWrong.filter((index) => percentages[index] < correctPercent - 1);
    if (eligible.length === 0) break;
    const chosen = eligible[Math.floor(random() * eligible.length)];
    percentages[chosen] += 1;
    remaining -= 1;
  }
  return percentages;
};

// Người thân chọn đúng với xác suất 80%; 20% còn lại chọn một phương án SAI đang hiển thị.
// Hàm này chỉ chọn gợi ý; 3 giây chờ được xử lý bằng useEffect trong Play.
export const generatePhoneHint = (correctAnswer, hiddenIndexes = [], random = Math.random) => {
  const visibleWrong = [0, 1, 2, 3].filter(
    (index) => index !== correctAnswer && !hiddenIndexes.includes(index)
  );
  if (random() < 0.8 || visibleWrong.length === 0) {
    return { index: correctAnswer, isCorrect: true };
  }
  const position = Math.floor(random() * visibleWrong.length);
  return { index: visibleWrong[position], isCorrect: false };
};
