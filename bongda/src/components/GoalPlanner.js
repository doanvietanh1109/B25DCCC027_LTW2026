import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEAMS } from '../data';
import { selectGoal, setRemaining, setTarget, setTeamId } from '../features/goalSlice';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const goal = useSelector(selectGoal);
  const dispatch = useDispatch();
  const message = useMemo(() => calcNeeded(standings, goal.teamId, goal.target, goal.remaining), [standings, goal.teamId, goal.target, goal.remaining]);
  return <div><div className="form-grid goal-grid">
    <div className="field"><label htmlFor="goal-team">Đội của bạn</label><select id="goal-team" value={goal.teamId} onChange={(event) => dispatch(setTeamId(event.target.value))}>{TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></div>
    <div className="field"><label htmlFor="goal-target">Số điểm mục tiêu</label><input id="goal-target" type="number" value={goal.target} onChange={(event) => dispatch(setTarget(event.target.value))} /></div>
    <div className="field"><label htmlFor="goal-remaining">Số trận còn lại</label><input id="goal-remaining" type="number" value={goal.remaining} onChange={(event) => dispatch(setRemaining(event.target.value))} /></div>
  </div><p className="goal-result" aria-live="polite">{message}</p></div>;
};

export default GoalPlanner;
