let req = {
	footballData: {
		leaguesBaseURL: 'https://api.football-data.org/v2/competitions/',
		leaguesKeys: ['PL/', 'PD/', 'CL/'],
		scheduledFilter: 'matches?status=SCHEDULED',
		liveFilter: 'matches?status=LIVE',
		requestOptions: {
			headers: {
				'X-Auth-Token': `${process.env.REACT_APP_footballDataToken}`,
			},
		},
	},

	rapidApi: {
		currentSeasonLeaguesURL: 'https://api-football-v1.p.rapidapi.com/v2/leagues/current/',
		leaguesBaseURL: 'https://api-football-v1.p.rapidapi.com/v2/teams/league/',
		requestOptions: {
			headers: {
				'x-rapidapi-key': `${process.env.REACT_APP_rapidApiToken}`,
				'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
				useQueryString: true,
			},
		},
	},
};

// PL id - 2790
// PD id - 2833
// Cl id - 2771
// EC id - 2018

export default req;
