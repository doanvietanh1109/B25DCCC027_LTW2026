import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('answering'); // answering → locked → revealed
  const question = questions[questionIndex];

  const finish = useCallback((reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  }, [navigate, playerName]);

  const handleAnswer = (index) => {
    if (status !== 'answering') return;
    setSelected(index);
    setStatus('locked');
  };

  // Đồng hồ hoạt động chỉ khi còn được chọn đáp án.
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

  // Đợi 1 giây để hiện kết quả, rồi đợi 2 giây để chuyển câu/kết thúc.
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
            setStatus('answering');
          }
        } else {
          finish('wrong', questionIndex);
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, selected, question, questionIndex, questions.length, finish]);

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
        />
      </div>
      <MoneyLadder currentQuestion={questionIndex + 1} />
    </div>
  );
};

export default Play;
