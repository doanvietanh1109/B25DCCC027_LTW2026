import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, generateAudienceVotes } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('answering'); // answering → locked → revealed
  const [hiddenIndexes, setHiddenIndexes] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false, quit: false });
  const question = questions[questionIndex];

  const finish = useCallback((reason, correctCount) => {
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

  // Đồng hồ chỉ hoạt động trong giai đoạn chọn đáp án.
  useEffect(() => {
    if (status !== 'answering' || !question) return;
    const interval = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, questionIndex, question]);

  useEffect(() => {
    if (status === 'answering' && timeLeft === 0) {
      finish('timeout', questionIndex);
    }
  }, [status, timeLeft, questionIndex, finish]);

  // Mỗi trạng thái hẹn giờ riêng và đều dọn timer khi đổi trạng thái / rời trang.
  useEffect(() => {
    if (!question) return;
    if (status === 'locked') {
      const timeout = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(timeout);
    }
    if (status === 'revealed') {
      const timeout = setTimeout(() => {
        if (selected === question.answer) {
          if (questionIndex === questions.length - 1) {
            finish('win', questionIndex + 1);
          } else {
            setQuestionIndex((previous) => previous + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setSelected(null);
            setHiddenIndexes([]);
            setAudience(null);
            setStatus('answering');
          }
        } else {
          finish('wrong', questionIndex);
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, selected, question, questionIndex, questions.length, finish]);

  const handleFifty = () => {
    if (status !== 'answering' || used.fifty || !question) return;
    const wrongOptions = [0, 1, 2, 3].filter((index) => index !== question.answer);
    // Fisher-Yates: chọn ngẫu nhiên 2/3 đáp án sai.
    for (let i = wrongOptions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
    }
    const hidden = wrongOptions.slice(0, 2);
    setHiddenIndexes(hidden);
    if (audience) setAudience(generateAudienceVotes(question.answer, hidden));
    setUsed((previous) => ({ ...previous, fifty: true }));
  };

  const handleAudience = () => {
    if (status !== 'answering' || used.audience || !question) return;
    setAudience(generateAudienceVotes(question.answer, hiddenIndexes));
    setUsed((previous) => ({ ...previous, audience: true }));
  };

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

  if (!question) return <p className="notice">Không có câu hỏi để chơi.</p>;

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
          total={questions.length}
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
          onQuit={handleQuit}
        />
        {audience && <AudienceChart percentages={audience} />}
        <p className="keyboard-hint">Mẹo: bấm phím A, B, C, D để chọn đáp án.</p>
      </div>
      <MoneyLadder currentQuestion={questionIndex + 1} />
    </div>
  );
};

export default Play;
