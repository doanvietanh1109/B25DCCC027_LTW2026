import { memo, useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getResult, getTeamName } from '../utils';

const MatchRow = memo(({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const home = getTeamName(match.home);
  const away = getTeamName(match.away);
  const result = getResult(match);
  return <tr className={result === 'draw' ? 'draw-row' : ''}>
    <td>Vòng {match.round}</td><td>{home}</td>
    <td><input aria-label={`Bàn thắng nhà ${home} - ${away}`} type="number" min="0" max="20" value={match.homeGoals} onChange={(event) => onGoals(match, 'homeGoals', event.target.valueAsNumber)} /></td>
    <td><input aria-label={`Bàn thắng khách ${home} - ${away}`} type="number" min="0" max="20" value={match.awayGoals} onChange={(event) => onGoals(match, 'awayGoals', event.target.valueAsNumber)} /></td>
    <td>{away}</td><td>{RESULT_LABELS[result]}</td><td>{renderCount.current}</td>
    <td><button className="button danger" type="button" onClick={() => onRemove(match)}>Xóa</button></td>
  </tr>;
});

export default MatchRow;
