import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, createGameQuestions, generateAudienceVotes, generatePhoneHint, shuffleArray } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  // Khởi tạo MỘT LẦN cho cả ván: không tráo lại khi state render, không sửa questions từ App.
  const [gameQuestions] = useState(() => createGameQuestions(questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [hiddenIndexes, setHiddenIndexes] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false, phone: false, quit: false });
  const [phoneState, setPhoneState] = useState('idle'); // idle -> calling -> ready
  const [phoneHint, setPhoneHint] = useState(null);
  const hiddenIndexesRef = useRef(hiddenIndexes);
  const finishedRef = useRef(false);
  const question = gameQuestions[questionIndex];

  useEffect(() => {
    hiddenIndexesRef.current = hiddenIndexes;
  }, [hiddenIndexes]);

  const finish = useCallback((reason, correctCount) => {
    if (finishedRef.current) return;
    finishedRef.current = true; // Không lưu trùng nếu có 2 sự kiện kết thúc gần nhau.
    const prize = calcPrize(correctCount, reason);
    const result = { name: playerName, prize, correctCount, reason };
    onFinish(result);
    navigate('/result', { replace: true, state: result });
  }, [navigate, playerName, onFinish]);

  const handleAnswer = useCallback((index) => {
    if (status !== 'answering' || hiddenIndexes.includes(index)) return;
    setSelected(index);
    setStatus('locked');
  }, [status, hiddenIndexes]);

  useEffect(() => {
    if (status !== 'answering' || !question) return;
    const interval = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, questionIndex, question]);

  useEffect(() => {
    if (status === 'answering' && timeLeft === 0) finish('timeout', questionIndex);
  }, [status, timeLeft, questionIndex, finish]);

  // Chốt cam 1 giây; lộ kết quả thêm 2 giây; cleanup khi rời trang.
  useEffect(() => {
    if (!question) return;
    if (status === 'locked') {
      const timeout = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(timeout);
    }
    if (status === 'revealed') {
      const timeout = setTimeout(() => {
        if (selected === question.answer) {
          if (questionIndex === gameQuestions.length - 1) {
            finish('win', questionIndex + 1);
          } else {
            setQuestionIndex((previous) => previous + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setSelected(null);
            setHiddenIndexes([]);
            setAudience(null);
            setPhoneState('idle');
            setPhoneHint(null);
            setStatus('answering');
          }
        } else finish('wrong', questionIndex);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, selected, question, questionIndex, gameQuestions.length, finish]);

  const handleFifty = () => {
    if (status !== 'answering' || used.fifty || !question) return;
    const wrongOptions = shuffleArray([0, 1, 2, 3].filter((index) => index !== question.answer));
    const hidden = wrongOptions.slice(0, 2);
    setHiddenIndexes(hidden);
    if (audience) setAudience(generateAudienceVotes(question.answer, hidden));
    // Không đưa gợi ý sai đã hiện của người thân vào đáp án bị ẩn.
    if (phoneState === 'ready' && hidden.includes(phoneHint)) {
      const visibleWrong = wrongOptions.find((index) => !hidden.includes(index));
      setPhoneHint(visibleWrong);
    }
    setUsed((previous) => ({ ...previous, fifty: true }));
  };

  const handleAudience = () => {
    if (status !== 'answering' || used.audience || !question) return;
    setAudience(generateAudienceVotes(question.answer, hiddenIndexes));
    setUsed((previous) => ({ ...previous, audience: true }));
  };

  const handlePhone = () => {
    if (status !== 'answering' || used.phone || !question) return;
    setUsed((previous) => ({ ...previous, phone: true }));
    setPhoneHint(null);
    setPhoneState('calling');
  };

  useEffect(() => {
    if (phoneState !== 'calling' || status !== 'answering' || !question) return;
    const timeout = setTimeout(() => {
      const hint = generatePhoneHint(question.answer, hiddenIndexesRef.current);
      setPhoneHint(hint.index);
      setPhoneState('ready');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [phoneState, status, question]);

  const handleQuit = () => {
    if (status !== 'answering' || used.quit) return;
    setUsed((previous) => ({ ...previous, quit: true }));
    finish('quit', questionIndex);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      const index = LETTERS.indexOf(event.key.toUpperCase());
      if (index !== -1) handleAnswer(index);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleAnswer]);

  useEffect(() => {
    document.title = `Câu ${questionIndex + 1}/15 – ${playerName}`;
    return () => { document.title = 'Ai là triệu phú'; };
  }, [questionIndex, playerName]);

  if (!question) return <p className="notice error">Ngân hàng phải có ít nhất 5 câu hỏi ở mỗi mức độ để bắt đầu.</p>;

  return (
    <div className="play-layout">
      <div className="play-main">
        <div className="play-topbar">
          <span className="player-chip">Người chơi: {playerName}</span>
          <Timer seconds={timeLeft} />
        </div>
        <QuestionCard
          question={question}
          questionNumber={questionIndex + 1}
          total={gameQuestions.length}
          selected={selected}
          status={status}
          onAnswer={handleAnswer}
          hiddenIndexes={hiddenIndexes}
        />
        <Lifelines
          used={used}
          disabled={status !== 'answering'}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onPhone={handlePhone}
          onQuit={handleQuit}
        />
        {phoneState === 'calling' && status === 'answering' && (
          <section className="phone-panel" role="status">Đang kết nối với người thân... Vui lòng chờ 3 giây.</section>
        )}
        {phoneState === 'ready' && phoneHint !== null && (
          <section className="phone-panel" role="status">
            Người thân gợi ý: <strong>{LETTERS[phoneHint]}</strong>. Đây chỉ là gợi ý, không đảm bảo chính xác.
          </section>
        )}
        {audience && <AudienceChart percentages={audience} />}
        <p className="keyboard-hint">Mẹo: bấm phím A, B, C, D để chọn đáp án.</p>
      </div>
      <MoneyLadder currentQuestion={questionIndex + 1} />
    </div>
  );
};

export default Play;
