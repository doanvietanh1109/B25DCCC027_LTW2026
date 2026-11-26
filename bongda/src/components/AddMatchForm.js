import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUNDS, TEAMS } from '../data';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { isValidGoals } from '../utils';

const initialForm = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const AddMatchForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
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
    const match = { round: Number(form.round), home: Number(form.home), away: Number(form.away), homeGoals: Number(form.homeGoals), awayGoals: Number(form.awayGoals) };
    dispatch(addMatch(match));
    showNotice(`Đã thêm trận ${TEAMS.find((team) => team.id === match.home).name} - ${TEAMS.find((team) => team.id === match.away).name}`);
    setForm(initialForm);
  };
  const field = (name, label, options, emptyLabel) => (
    <div className="field"><label htmlFor={`match-${name}`}>{label}</label>
      {options ? <select id={`match-${name}`} name={name} value={form[name]} onChange={update}>{emptyLabel && <option value="">{emptyLabel}</option>}{options.map((option) => <option key={option.id ?? option} value={option.id ?? option}>{option.name ?? `Vòng ${option}`}</option>)}</select> : <input id={`match-${name}`} name={name} type="number" min="0" max="20" value={form[name]} onChange={update} />}
      {errors[name] && <small role="alert">{errors[name]}</small>}
    </div>
  );
  return <form className="form-grid" onSubmit={submit} noValidate>{field('round', 'Vòng', ROUNDS)}{field('home', 'Đội nhà', TEAMS, '-- Chọn đội --')}{field('away', 'Đội khách', TEAMS, '-- Chọn đội --')}{field('homeGoals', 'Bàn thắng đội nhà')}{field('awayGoals', 'Bàn thắng đội khách')}<div className="form-action"><button className="button primary" type="submit">Thêm trận</button></div></form>;
};

export default AddMatchForm;
