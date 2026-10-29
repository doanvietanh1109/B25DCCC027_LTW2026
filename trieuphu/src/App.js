const BUILD_TAG = "tp-4186";
/* eslint-disable import/first -- Dòng đầu App.js cố định theo đề TH02. */

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const HISTORY_KEY = 'ltw_trieuphu_history';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    axios.get('/data/questions.json', { signal: controller.signal })
      .then(({ data }) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Khi history thay đổi, lưu xuống trình duyệt để F5 không mất dữ liệu.
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleFinish = useCallback(({ name, prize, correctCount }) => {
    setHistory((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        prize,
        correctCount,
        playedAt: new Date().toLocaleString('vi-VN'),
      },
    ]);
  }, []);

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route index element={<Home playerName={playerName} onPlayerNameChange={setPlayerName} history={history} />} />
          <Route path="play" element={playerName.trim() ? <Play questions={questions} playerName={playerName.trim()} onFinish={handleFinish} /> : <Navigate to="/" replace />} />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History history={history} onClear={() => setHistory([])} />} />
          <Route path="questions" element={<QuestionBank questions={questions} />} />
          <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
