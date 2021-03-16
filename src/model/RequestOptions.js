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

// PL id - 2790
// PD id - 2833
// Cl id - 2771

export default req;