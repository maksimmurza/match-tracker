export const SCHEDULE_URL = 'https://api.football-data.org/v2/competitions/';
export const LEAGUES_KEYS = ['PL/', 'PD/', 'CL/'];
export const SCHEDULED_FILTER = 'matches?status=SCHEDULED';
export const LIVE_FILTER = 'matches?status=LIVE';
export const FOOTBALL_DATA_REQUEST_OPTIONS = {
	headers: {
		'X-Auth-Token': `${process.env.REACT_APP_footballDataToken}`,
	},
};

export const CURRENT_SEASON_LEAGUES_URL = 'https://api-football-v1.p.rapidapi.com/v2/leagues/current/';
export const TEAMS_INFO_URL = 'https://api-football-v1.p.rapidapi.com/v2/teams/league/';
export const RAPID_API_REQUEST_OPTIONS = {
	headers: {
		'x-rapidapi-key': `${process.env.REACT_APP_rapidApiToken}`,
		'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
	},
};
