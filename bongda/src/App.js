import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { formatDiff, RESULT_LABELS, ROUNDS, TEAMS } from './data';
import matchesReducer from './matchesReducer';
import useFetch from './hooks/useFetch';
import { calcMatchStats, calcStandings, getResult, getTeamName, isValidGoals } from './utils';

const BUILD_TAG = "bd-5918";
const initialForm = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const App = () => {
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [round, setRound] = useState('all');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const homeSelectRef = useRef(null);
  const { data, loading, error } = useFetch('/data/matches.json');

  useEffect(() => { if (data) dispatch({ type: 'LOAD', payload: data }); }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const leader = standings[0];
  const shownMatches = useMemo(() => round === 'all' ? matches : matches.filter((match) => match.round === Number(round)), [matches, round]);
  const stats = useMemo(() => calcMatchStats(shownMatches), [shownMatches]);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateGoals = (match, field, event) => {
    const value = event.target.valueAsNumber;
    if (!isValidGoals(value)) return;
    dispatch({ type: 'SET_GOALS', payload: { id: match.id, homeGoals: field === 'homeGoals' ? value : match.homeGoals, awayGoals: field === 'awayGoals' ? value : match.awayGoals } });
  };

  const submitMatch = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.home) nextErrors.home = 'Hãy chọn đội nhà';
    if (!form.away) nextErrors.away = 'Hãy chọn đội khách';
    else if (form.home && form.home === form.away) nextErrors.away = 'Hai đội phải khác nhau';
    else if (form.home && matches.some((match) => (match.home === Number(form.home) && match.away === Number(form.away)) || (match.home === Number(form.away) && match.away === Number(form.home)))) nextErrors.away = 'Hai đội đã đá với nhau rồi';
    if (form.homeGoals === '' || !isValidGoals(Number(form.homeGoals))) nextErrors.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    if (form.awayGoals === '' || !isValidGoals(Number(form.awayGoals))) nextErrors.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    dispatch({ type: 'ADD', payload: { round: Number(form.round), home: Number(form.home), away: Number(form.away), homeGoals: Number(form.homeGoals), awayGoals: Number(form.awayGoals) } });
    setForm(initialForm);
    homeSelectRef.current?.focus();
  };

  const field = (name, label, options, emptyLabel) => (
    <div className="field"><label htmlFor={`match-${name}`}>{label}</label>
      {options ? <select ref={name === 'home' ? homeSelectRef : undefined} id={`match-${name}`} name={name} value={form[name]} onChange={updateForm}>{emptyLabel && <option value="">{emptyLabel}</option>}{options.map((option) => <option key={option.id ?? option} value={option.id ?? option}>{option.name ?? `Vòng ${option}`}</option>)}</select> : <input id={`match-${name}`} name={name} type="number" min="0" max="20" value={form[name]} onChange={updateForm} />}
      {errors[name] && <small role="alert">{errors[name]}</small>}
    </div>
  );

  return <div className="app" data-build={BUILD_TAG}>
    <main className="page-shell">
      <header className="page-header"><div><p className="eyebrow">MÙA GIẢI · 2026</p><h1>Giải bóng đá khoa</h1><p className="subtitle">Lịch đấu, bảng xếp hạng và thống kê các đội.</p></div></header>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">TỔNG QUAN</p><h2>Bảng xếp hạng</h2></div></div>
        <div className="table-wrap"><table><thead><tr>{['Hạng', 'Đội', 'Trận', 'Thắng', 'Hòa', 'Thua', 'BT', 'BB', 'HS', 'Điểm'].map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{standings.map((team, index) => <tr key={team.id} className={index === standings.length - 1 ? 'last-place' : ''}><td>{index + 1}</td><td>{team.name}</td><td>{team.played}</td><td>{team.won}</td><td>{team.drawn}</td><td>{team.lost}</td><td>{team.gf}</td><td>{team.ga}</td><td>{formatDiff(team.diff)}</td><td>{team.points}</td></tr>)}</tbody></table></div>
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">SỐ LIỆU</p><h2>Thống kê</h2></div></div>
        <div className="stats-grid"><p>Số trận: <strong>{stats.count}</strong></p><p>Tổng số bàn thắng: <strong>{stats.goals}</strong></p><p>Bàn thắng mỗi trận: <strong>{stats.average.toFixed(2)}</strong></p><p>Đội dẫn đầu: <strong>{matches.length ? `${leader.name} (${leader.points} điểm)` : '—'}</strong></p></div>
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">TRẬN ĐẤU</p><h2>Lịch thi đấu</h2></div></div>
        <div className="filters"><div className="field compact"><label htmlFor="round-filter">Xem vòng</label><select id="round-filter" value={round} onChange={(event) => setRound(event.target.value)}><option value="all">Tất cả</option>{ROUNDS.map((item) => <option key={item} value={item}>Vòng {item}</option>)}</select></div></div>
        {loading && <p className="loading-state">Đang tải lịch thi đấu...</p>}
        {error && <p className="error-state">Không tải được lịch thi đấu.</p>}
        {!loading && !error && (shownMatches.length === 0 ? <p className="empty-state">Chưa có trận đấu nào</p> : <div className="table-wrap"><table className="fixtures-table"><thead><tr><th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th><th>Đội khách</th><th>Kết quả</th><th>Xóa</th></tr></thead><tbody>{shownMatches.map((match) => {
          const home = getTeamName(match.home); const away = getTeamName(match.away); const result = getResult(match);
          return <tr key={match.id} className={result === 'draw' ? 'draw-row' : ''}><td>Vòng {match.round}</td><td>{home}</td><td><input aria-label={`Bàn thắng nhà ${home} - ${away}`} type="number" min="0" max="20" value={match.homeGoals} onChange={(event) => updateGoals(match, 'homeGoals', event)} /></td><td><input aria-label={`Bàn thắng khách ${home} - ${away}`} type="number" min="0" max="20" value={match.awayGoals} onChange={(event) => updateGoals(match, 'awayGoals', event)} /></td><td>{away}</td><td>{RESULT_LABELS[result]}</td><td><button className="button danger" type="button" onClick={() => dispatch({ type: 'REMOVE', payload: match.id })}>Xóa</button></td></tr>;
        })}</tbody></table></div>)}
      </section>

      <section className="panel"><div className="section-heading"><div><p className="eyebrow">QUẢN LÝ</p><h2>Thêm trận đấu</h2></div></div>
        <form className="form-grid" onSubmit={submitMatch} noValidate>{field('round', 'Vòng', ROUNDS)}{field('home', 'Đội nhà', TEAMS, '-- Chọn đội --')}{field('away', 'Đội khách', TEAMS, '-- Chọn đội --')}{field('homeGoals', 'Bàn thắng đội nhà')}{field('awayGoals', 'Bàn thắng đội khách')}<div className="form-action"><button className="button primary" type="submit">Thêm trận</button></div></form>
      </section>
      <footer>Giải bóng đá khoa · 6 đội · 5 vòng</footer>
    </main>
  </div>;
};

export default App;
