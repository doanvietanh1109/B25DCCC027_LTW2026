import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RESULT_LABELS, ROUNDS } from './data';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { hasSaved } from './store';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import useLocalStorage from './hooks/useLocalStorage';
import { calcMatchStats, calcStandings, getTeamName, isValidGoals } from './utils';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = "bd-5918";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [round, setRound] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);
  const { data: sampleMatches, loading, error } = useFetch('/data/matches.json');

  useEffect(() => {
    if (!hasSaved && sampleMatches) dispatch(setMatches(sampleMatches));
  }, [dispatch, sampleMatches]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const leader = standings[0];
  const roundMatches = useMemo(() => round === 'all' ? matches : matches.filter((match) => match.round === Number(round)), [matches, round]);
  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);
  const visibleMatches = useMemo(() => {
    const query = debouncedSearch.trim().toLocaleLowerCase('vi');
    return roundMatches.filter((match) => !query || getTeamName(match.home).toLocaleLowerCase('vi').includes(query) || getTeamName(match.away).toLocaleLowerCase('vi').includes(query));
  }, [roundMatches, debouncedSearch]);

  useEffect(() => {
    document.title = matches.length && leader ? `${leader.name} dẫn đầu – Giải bóng đá khoa` : 'Giải bóng đá khoa';
  }, [matches.length, leader]);

  const handleGoals = useCallback((match, field, value) => {
    if (!isValidGoals(value)) return;
    dispatch(setGoals({ id: match.id, homeGoals: field === 'homeGoals' ? value : match.homeGoals, awayGoals: field === 'awayGoals' ? value : match.awayGoals }));
  }, [dispatch]);
  const handleRemove = useCallback((match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  }, [dispatch, showNotice]);
  const handleTeamShift = useCallback((event) => setSearch(event.target.value), []);

  useEffect(() => {
    const handleKey = (event) => {
      const target = event.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName));
      if (event.key === '/' && !editing) { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === 'Escape' && target === searchRef.current) setSearch('');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const resetSamples = () => {
    if (!sampleMatches) return;
    dispatch(setMatches(sampleMatches));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };

  return <div className={`app ${theme}`} data-build={BUILD_TAG}>
    <main className="page-shell">
      <header className="page-header"><div><p className="eyebrow">MÙA GIẢI · 2026</p><h1>Giải bóng đá khoa</h1><p className="subtitle">Lịch đấu, bảng xếp hạng và thống kê các đội.</p></div><button className="button theme-button" type="button" onClick={toggleTheme}>Chế độ {theme === 'light' ? 'tối' : 'sáng'}</button></header>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">TỔNG QUAN</p><h2>Bảng xếp hạng</h2></div></div><StandingsTable standings={standings} /></section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">SỐ LIỆU</p><h2>Thống kê</h2></div></div>
        <div className="stats-grid"><p>Số trận: <strong>{stats.count}</strong></p><p>Tổng số bàn thắng: <strong>{stats.goals}</strong></p><p>Bàn thắng mỗi trận: <strong>{stats.average.toFixed(2)}</strong></p><p>Đội dẫn đầu: <strong>{matches.length ? `${leader.name} (${leader.points} điểm)` : '—'}</strong></p></div>
        <h3 className="subheading">Phân bố kết quả</h3>
        <ul className="distribution">{Object.entries(RESULT_LABELS).map(([key, label]) => <li key={key}><span>{label}: {stats.counts[key]}</span><span className="bar-track"><span className="bar" style={{ width: `${24 * stats.counts[key]}px` }} /></span></li>)}</ul>
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">TRẬN ĐẤU</p><h2>Lịch thi đấu</h2></div><button className="button secondary" type="button" onClick={resetSamples} disabled={!sampleMatches}>Đặt lại dữ liệu mẫu</button></div>
        <div className="filters">
          <div className="field compact"><label htmlFor="round-filter">Xem vòng</label><select id="round-filter" value={round} onChange={(event) => setRound(event.target.value)}><option value="all">Tất cả</option>{ROUNDS.map((item) => <option key={item} value={item}>Vòng {item}</option>)}</select></div>
          <div className="field compact search-field"><label htmlFor="team-search">Tìm đội</label><input id="team-search" ref={searchRef} type="search" value={search} onChange={handleTeamShift} placeholder="Nhập tên đội..." /></div>
        </div>
        <p className="results-count">Tìm thấy {visibleMatches.length} trận</p>
        {!hasSaved && loading && <p className="loading-state">Đang tải lịch thi đấu...</p>}
        {!hasSaved && error && !sampleMatches && <p className="error-state">Không tải được lịch thi đấu.</p>}
        {(hasSaved || (!loading && !error)) && (visibleMatches.length === 0 ? <p className="empty-state">Chưa có trận đấu nào</p> : <div className="table-wrap"><table className="fixtures-table"><thead><tr><th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th><th>Đội khách</th><th>Kết quả</th><th>Số lần render</th><th>Xóa</th></tr></thead><tbody>{visibleMatches.map((match) => <MatchRow key={match.id} match={match} onGoals={handleGoals} onRemove={handleRemove} />)}</tbody></table></div>)}
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">QUẢN LÝ</p><h2>Thêm trận đấu</h2></div></div><AddMatchForm /></section>
      <section className="panel"><div className="section-heading"><div><p className="eyebrow">KẾ HOẠCH</p><h2>Mục tiêu điểm</h2></div></div><GoalPlanner standings={standings} /></section>
      <footer>Giải bóng đá khoa · 6 đội · 5 vòng</footer>
    </main>
  </div>;
};

export default App;
