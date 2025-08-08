// nflColorUtils.js
import nflColors from './NFLColors.json';

const teamColorMap = {};
nflColors.forEach(team => {
  teamColorMap[team.team] = [team.color, team.color2]
    .filter(Boolean); // remove empty strings
});

export function getTeamGradient(teamAbbrev) {
  const colors = teamColorMap[teamAbbrev];
  if (!colors || colors.length === 0) {
    return 'linear-gradient(150deg, #999, #666)'; // fallback
  }
  return `linear-gradient(150deg, ${colors.join(', ')})`;
}
