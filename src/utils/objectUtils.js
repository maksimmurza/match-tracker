import League from '../model/League';

function createLeague(leaguePlainObject) {
	let league = new League(leaguePlainObject.id);
	league.name = leaguePlainObject.name;
	league.country = leaguePlainObject.country;
	league.logo = leaguePlainObject.logo;
	league.matches = leaguePlainObject.matches;
	league.teams = leaguePlainObject.teams;
	league.status = leaguePlainObject.status;
	league.activeTeams = leaguePlainObject.activeTeams;
	league.teamsShowed = leaguePlainObject.teamsShowed;
	return league;
}

function copyLeague(copiedLeague) {
	return createLeague(JSON.parse(JSON.stringify(copiedLeague)));
}

export { createLeague, copyLeague };
