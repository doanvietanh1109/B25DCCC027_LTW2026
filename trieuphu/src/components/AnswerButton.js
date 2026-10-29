import { LETTERS } from '../data';

const AnswerButton = ({ index, option, answer, selected, status, onClick, hidden = false }) => {
  let answerClass = '';
  if (status === 'locked' && selected === index) answerClass = 'answer-locked';
  if (status === 'revealed') {
    if (answer === index) answerClass = 'answer-correct';
    else if (selected === index) answerClass = 'answer-wrong';
  }

  return (
    <button
      type="button"
      className={`answer-button ${answerClass} ${hidden ? 'answer-hidden' : ''}`}
      onClick={() => onClick(index)}
      disabled={status !== 'answering' || hidden}
      aria-label={hidden ? `Đáp án ${LETTERS[index]} đã bị ẩn` : `${LETTERS[index]}. ${option}`}
    >
      {hidden ? '\u00a0' : <><strong>{LETTERS[index]}.</strong> {option}</>}
    </button>
  );
};

export default AnswerButton;
