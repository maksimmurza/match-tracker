import tokenForShedule from '../tokens/token-football-data.json'
import tokenForLogo from '../tokens/token-rapid-api.json'

let req = {
		footballData: {
			leaguesBaseURL: 'https://api.football-data.org/v2/competitions/',
			leaguesKeys: ['PL/', 'PD/', 'CL/'],
			scheduledFilter: 'matches?status=SCHEDULED',
			liveFilter: 'matches?status=LIVE',
			requestOptions: {
				headers: {
					'X-Auth-Token' : tokenForShedule
				}
			}
		},

		rapidApi: {
			currentSeasonLeaguesURL: 'https://api-football-v1.p.rapidapi.com/v2/leagues/current/',
			leaguesBaseURL: 'https://api-football-v1.p.rapidapi.com/v2/teams/league/',
			requestOptions: {
				headers: {
					"x-rapidapi-key": tokenForLogo,
					"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
					"useQueryString": true
				}
			}
		}
}

// leagues: [
// 	{
// 		name: 'English Premier League',
// 		scheduleURL: 'https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED',
// 		logoURL: 'https://api-football-v1.p.rapidapi.com/v2/teams/league/2790'
// 	},
// 	{
// 		name: 'Primera Division',
// 		scheduleURL: 'https://api.football-data.org/v2/competitions/PD/matches?status=SCHEDULED',
// 		logoURL: 'https://api-football-v1.p.rapidapi.com/v2/teams/league/2833'
// 	},
// 	{
// 		name: 'UEFA Champions League',
// 		scheduleURL: 'https://api.football-data.org/v2/competitions/CL/matches?status=SCHEDULED',
// 		logoURL: 'https://api-football-v1.p.rapidapi.com/v2/teams/league/2771'
// 	}
// ]

class League {
	name;
	logoURL;
	matches;
	teams;
	status = 'checked';
	teamsShowed;
	// indeterminate = false;

	constructor(name, country) {
		this.name = name;
		this.country = country;
	}
}


export { req, League };