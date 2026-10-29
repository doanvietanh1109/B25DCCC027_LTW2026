import { useNavigate } from 'react-router-dom';
import { formatMoney, TIME_PER_QUESTION } from '../data';

const Home = ({ playerName, onPlayerNameChange }) => {
  const navigate = useNavigate();

  const handleStart = (event) => {
    event.preventDefault();
    if (playerName.trim()) navigate('/play');
  };

  return (
    <section className="panel hero">
      <p className="eyebrow">BẠN ĐÃ SẴN SÀNG?</p>
      <h1>Ai là triệu phú</h1>
      <p className="hero-subtitle">15 câu hỏi · HTML, CSS, ES6 và React · Giải thưởng {formatMoney(250000000)}</p>
      <div className="rules">
        <h2>Luật chơi</h2>
        <p>Mỗi câu có {TIME_PER_QUESTION} giây để lựa chọn đáp án. Trả lời đúng để tiến lên bậc tiền thưởng tiếp theo.</p>
        <p>Câu 5, 10 và 15 là các mốc an toàn. Nếu trả lời sai hoặc hết giờ, bạn nhận tiền ở mốc an toàn đã vượt qua.</p>
      </div>
      <form className="start-form" onSubmit={handleStart}>
        <label className="form-label" htmlFor="playerName">Tên người chơi</label>
        <input id="playerName" value={playerName} onChange={(event) => onPlayerNameChange(event.target.value)} placeholder="Ví dụ: An" autoComplete="off" />
        <button className="button start-button" disabled={!playerName.trim()} type="submit">Bắt đầu chơi</button>
      </form>
    </section>
  );
};

export default Home;
