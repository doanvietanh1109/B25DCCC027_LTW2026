import AnswerButton from './AnswerButton';

const QuestionCard = ({ question, questionNumber, total, selected, status, onAnswer, hiddenIndexes = [] }) => (
  <section className="question-card">
    <p className="eyebrow">CÂU HỎI {questionNumber}/{total}</p>
    <h2>{question.question}</h2>
    <div className="answer-grid">
      {question.options.map((option, index) => (
        <AnswerButton
          key={index}
          index={index}
          option={option}
          answer={question.answer}
          selected={selected}
          status={status}
          onClick={onAnswer}
          hidden={hiddenIndexes.includes(index)}
        />
      ))}
    </div>
  </section>
);

export default QuestionCard;
