import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RESULT_LABELS, ROUNDS } from './data';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import useFetch from './hooks/useFetch';
import { calcMatchStats, calcStandings, getResult, getTeamName, isValidGoals } from './utils';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = "bd-5918";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [round, setRound] = useState('all');
  const { data, loading, error } = useFetch('/data/matches.json');

  useEffect(() => { if (data) dispatch(setMatches(data)); }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const leader = standings[0];
  const shownMatches = useMemo(() => round === 'all' ? matches : matches.filter((match) => match.round === Number(round)), [matches, round]);
  const stats = useMemo(() => calcMatchStats(shownMatches), [shownMatches]);
  const handleGoals = (match, field, event) => {
    const value = event.target.valueAsNumber;
    if (!isValidGoals(value)) return;
    dispatch(setGoals({ id: match.id, homeGoals: field === 'homeGoals' ? value : match.homeGoals, awayGoals: field === 'awayGoals' ? value : match.awayGoals }));
  };
  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  return <div className={`app ${theme}`} data-build={BUILD_TAG}>
    <main className="page-shell">
      <header className="page-header"><div><p className="eyebrow">MÙA GIẢI · 2026</p><h1>Giải bóng đá khoa</h1><p className="subtitle">Lịch đấu, bảng xếp hạng và thống kê các đội.</p></div><button className="button theme-button" type="button" onClick={toggleTheme}>Chế độ {theme === 'light' ? 'tối' : 'sáng'}</button></header>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">TỔNG QUAN</p><h2>Bảng xếp hạng</h2></div></div><StandingsTable standings={standings} /></section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">SỐ LIỆU</p><h2>Thống kê</h2></div></div>
        <div className="stats-grid"><p>Số trận: <strong>{stats.count}</strong></p><p>Tổng số bàn thắng: <strong>{stats.goals}</strong></p><p>Bàn thắng mỗi trận: <strong>{stats.average.toFixed(2)}</strong></p><p>Đội dẫn đầu: <strong>{matches.length ? `${leader.name} (${leader.points} điểm)` : '—'}</strong></p></div>
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">TRẬN ĐẤU</p><h2>Lịch thi đấu</h2></div></div>
        <div className="filters"><div className="field compact"><label htmlFor="round-filter">Xem vòng</label><select id="round-filter" value={round} onChange={(event) => setRound(event.target.value)}><option value="all">Tất cả</option>{ROUNDS.map((item) => <option key={item} value={item}>Vòng {item}</option>)}</select></div></div>
        {loading && <p className="loading-state">Đang tải lịch thi đấu...</p>}{error && <p className="error-state">Không tải được lịch thi đấu.</p>}
        {!loading && !error && (shownMatches.length === 0 ? <p className="empty-state">Chưa có trận đấu nào</p> : <div className="table-wrap"><table className="fixtures-table"><thead><tr><th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th><th>Đội khách</th><th>Kết quả</th><th>Xóa</th></tr></thead><tbody>{shownMatches.map((match) => {
          const home = getTeamName(match.home); const away = getTeamName(match.away); const result = getResult(match);
          return <tr key={match.id} className={result === 'draw' ? 'draw-row' : ''}><td>Vòng {match.round}</td><td>{home}</td><td><input aria-label={`Bàn thắng nhà ${home} - ${away}`} type="number" min="0" max="20" value={match.homeGoals} onChange={(event) => handleGoals(match, 'homeGoals', event)} /></td><td><input aria-label={`Bàn thắng khách ${home} - ${away}`} type="number" min="0" max="20" value={match.awayGoals} onChange={(event) => handleGoals(match, 'awayGoals', event)} /></td><td>{away}</td><td>{RESULT_LABELS[result]}</td><td><button className="button danger" type="button" onClick={() => handleRemove(match)}>Xóa</button></td></tr>;
        })}</tbody></table></div>)}
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">QUẢN LÝ</p><h2>Thêm trận đấu</h2></div></div><AddMatchForm /></section>
      <section className="panel"><div className="section-heading"><div><p className="eyebrow">KẾ HOẠCH</p><h2>Mục tiêu điểm</h2></div></div><GoalPlanner standings={standings} /></section>
      <footer>Giải bóng đá khoa · 6 đội · 5 vòng</footer>
    </main>
  </div>;
};

export default App;
