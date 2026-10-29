import { calcPrize, createGameQuestions, generateAudienceVotes, generatePhoneHint, shuffleQuestionOptions } from './utils';

const bank = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  level: Math.floor(index / 10) + 1,
  question: `Câu ${index + 1}`,
  options: [`0-${index}`, `1-${index}`, `2-${index}`, `3-${index}`],
  answer: index % 4,
}));

test('trộn đáp án vẫn giữ đáp án đúng và không sửa dữ liệu gốc', () => {
  bank.forEach((question) => {
    const original = JSON.parse(JSON.stringify(question));
    const shuffled = shuffleQuestionOptions(question, () => 0);
    expect(shuffled.options[shuffled.answer]).toBe(question.options[question.answer]);
    expect(shuffled.options).toHaveLength(4);
    expect(question).toEqual(original);
  });
});

test('mỗi ván lấy 5 câu của từng mức, đủ 15, không trùng và không sửa ngân hàng', () => {
  const original = JSON.parse(JSON.stringify(bank));
  const game = createGameQuestions(bank, () => 0.3);
  expect(game).toHaveLength(15);
  expect(new Set(game.map(({ id }) => id)).size).toBe(15);
  expect(game.map(({ level }) => level)).toEqual([1,1,1,1,1,2,2,2,2,2,3,3,3,3,3]);
  game.forEach((question) => {
    const raw = bank.find(({ id }) => id === question.id);
    expect(question.options[question.answer]).toBe(raw.options[raw.answer]);
  });
  expect(bank).toEqual(original);
});

test('thiếu 5 câu ở một mức thì không tạo ván chơi', () => {
  expect(createGameQuestions(bank.filter((q) => q.level !== 3))).toEqual([]);
});

test('gợi ý điện thoại đúng ở ngưỡng dưới 80%, và sai khi trên ngưỡng', () => {
  expect(generatePhoneHint(1, [], () => 0.79)).toEqual({ index: 1, isCorrect: true });
  const wrong = generatePhoneHint(1, [0, 3], () => 0.9);
  expect(wrong).toEqual({ index: 2, isCorrect: false });
});

test('khán giả luôn chia tổng 100%, đáp án ẩn bằng 0%', () => {
  const votes = generateAudienceVotes(1, [0, 3], () => 0.5);
  expect(votes.reduce((sum, value) => sum + value, 0)).toBe(100);
  expect(votes[0]).toBe(0);
  expect(votes[3]).toBe(0);
  expect(votes[1]).toBeGreaterThan(votes[2]);
});

test('tiền thưởng đúng theo mốc an toàn hoặc dừng cuộc chơi', () => {
  expect(calcPrize(2, 'wrong')).toBe(0);
  expect(calcPrize(6, 'timeout')).toBe(2000000);
  expect(calcPrize(11, 'wrong')).toBe(22000000);
  expect(calcPrize(6, 'quit')).toBe(3000000);
  expect(calcPrize(15, 'win')).toBe(250000000);
});
