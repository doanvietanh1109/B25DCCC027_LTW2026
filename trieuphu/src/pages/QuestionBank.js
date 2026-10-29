import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');

  // Tên hàm bắt buộc theo đề TH02.
  const handleQueryShift = (event) => setQuery(event.target.value);

  const filteredQuestions = questions.filter((item) =>
    (level === 'all' || item.level === Number(level)) &&
    item.question.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <section className="panel">
      <p className="eyebrow">KHÁM PHÁ KIẾN THỨC</p>
      <h1>Ngân hàng câu hỏi</h1>
      <div className="filters">
        <label>Mức độ
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">Tất cả</option>
            <option value="1">Dễ</option>
            <option value="2">Trung bình</option>
            <option value="3">Khó</option>
          </select>
        </label>
        <label>Tìm kiếm theo nội dung câu hỏi
          <input value={query} onChange={handleQueryShift} placeholder="Nhập từ khóa..." />
        </label>
      </div>
      <p className="count">Có {filteredQuestions.length} câu hỏi</p>
      <div className="table-scroll">
        <table>
          <thead><tr><th>STT</th><th>Mức độ</th><th>Câu hỏi</th></tr></thead>
          <tbody>
            {filteredQuestions.map(({ id, level: itemLevel, question }) => (
              <tr key={id}>
                <td>{id}</td>
                <td><span className={`pill level-${itemLevel}`}>{LEVELS[itemLevel]}</span></td>
                <td><Link to={`/questions/${id}`}>{question}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuestionBank;
