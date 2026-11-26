import { formatDiff } from '../data';

const StandingsTable = ({ standings }) => (
  <div className="table-wrap"><table><thead><tr>{['Hạng', 'Đội', 'Trận', 'Thắng', 'Hòa', 'Thua', 'BT', 'BB', 'HS', 'Điểm'].map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{standings.map((team, index) => <tr key={team.id} className={index === standings.length - 1 ? 'last-place' : ''}><td>{index + 1}</td><td>{team.name}</td><td>{team.played}</td><td>{team.won}</td><td>{team.drawn}</td><td>{team.lost}</td><td>{team.gf}</td><td>{team.ga}</td><td>{formatDiff(team.diff)}</td><td>{team.points}</td></tr>)}</tbody></table></div>
);

export default StandingsTable;
