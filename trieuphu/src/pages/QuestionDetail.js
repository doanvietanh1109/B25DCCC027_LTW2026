import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS, LEVELS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find((item) => item.id === Number(id));

  if (!question) {
    return (
      <section className="panel">
        <h2>Không tìm thấy câu hỏi</h2>
        <button className="button secondary" onClick={() => navigate(-1)}>Quay lại</button>
      </section>
    );
  }

  return (
    <section className="panel">
      <p className="eyebrow">CHI TIẾT CÂU HỎI</p>
      <h1>Câu hỏi số {question.id} ({LEVELS[question.level]})</h1>
      <p className="question-text">{question.question}</p>
      <div className="options-list">
        {question.options.map((option, index) => (
          <div key={index} className={`option-row ${question.answer === index ? 'correct' : ''}`}>
            <strong>{LETTERS[index]}.</strong> {option}
            {question.answer === index && <span className="answer-note">(Đáp án đúng)</span>}
          </div>
        ))}
      </div>
      <button className="button secondary" onClick={() => navigate(-1)}>Quay lại</button>
    </section>
  );
};

export default QuestionDetail;
