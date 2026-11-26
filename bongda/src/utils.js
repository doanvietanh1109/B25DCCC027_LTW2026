import { MAX_GOALS, POINTS, TEAMS } from './data';

export const getTeamName = (id) => TEAMS.find((team) => team.id === Number(id))?.name ?? 'Không rõ đội';
export const getResult = (match) => (match.homeGoals > match.awayGoals ? 'home' : match.homeGoals < match.awayGoals ? 'away' : 'draw');
export const isValidGoals = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_GOALS;

export const calcStandings = (matches) => {
  const rows = TEAMS.map((team) => ({ ...team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, diff: 0, points: 0 }));
  const byId = new Map(rows.map((team) => [team.id, team]));
  matches.forEach((match) => {
    const home = byId.get(match.home);
    const away = byId.get(match.away);
    if (!home || !away) return;
    home.played += 1; away.played += 1;
    home.gf += match.homeGoals; home.ga += match.awayGoals;
    away.gf += match.awayGoals; away.ga += match.homeGoals;
    const result = getResult(match);
    if (result === 'home') { home.won += 1; away.lost += 1; home.points += POINTS.win; }
    else if (result === 'away') { away.won += 1; home.lost += 1; away.points += POINTS.win; }
    else { home.drawn += 1; away.drawn += 1; home.points += POINTS.draw; away.points += POINTS.draw; }
  });
  return rows.map((team) => ({ ...team, diff: team.gf - team.ga }))
    .sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf || a.name.localeCompare(b.name, 'vi'));
};

export const calcMatchStats = (matches) => {
  const stats = { count: matches.length, goals: 0, average: 0, counts: { home: 0, draw: 0, away: 0 } };
  matches.forEach((match) => { stats.goals += match.homeGoals + match.awayGoals; stats.counts[getResult(match)] += 1; });
  stats.average = stats.count ? Math.round((stats.goals / stats.count) * 100) / 100 : 0;
  return stats;
};
