import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const RESULT_TITLES = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  quit: 'Bạn đã dừng cuộc chơi',
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !RESULT_TITLES[state.reason]) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="panel result-panel center">
      <p className="eyebrow">KẾT QUẢ LƯỢT CHƠI</p>
      <h1>{RESULT_TITLES[state.reason]}</h1>
      <p>Người chơi: <strong>{state.name}</strong></p>
      <p>Số câu trả lời đúng: <strong>{state.correctCount}</strong></p>
      <p className="result-prize">Tiền thưởng: {formatMoney(state.prize)}</p>
      <div className="result-actions">
        <button className="button" onClick={() => navigate('/play')}>Chơi lại</button>
        <Link className="button secondary" to="/">Về trang chủ</Link>
      </div>
    </section>
  );
};

export default Result;
