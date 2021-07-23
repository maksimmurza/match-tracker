import {
	CURRENT_SEASON_LEAGUES_URL,
	SCHEDULE_URL,
	FOOTBALL_DATA_REQUEST_OPTIONS,
	TEAMS_INFO_URL,
	RAPID_API_REQUEST_OPTIONS,
} from './requestOptions';

async function getCurrentLeagues() {
	const response = await fetch(CURRENT_SEASON_LEAGUES_URL, RAPID_API_REQUEST_OPTIONS).catch(e => {
		throw new Error(e.message);
	});

	if (response.ok) {
		const data = await response.json();
		return data.api.leagues;
	} else {
		throw new Error();
	}
}

async function getSchedule(leagueKey, filter, attemps = 10) {
	let response, data;

	response = await fetch(SCHEDULE_URL + leagueKey + filter, FOOTBALL_DATA_REQUEST_OPTIONS).catch(error => {
		console.log(error.message);
	});

	if (response && response.ok) {
		data = await response.json();
		return data;
	} else {
		data = await new Promise(resolve => {
			if (attemps !== 0) {
				setTimeout(() => {
					resolve(getSchedule(leagueKey, filter, --attemps));
				}, 10000);
			} else {
				resolve(null);
			}
		});

		return data;
	}
}

async function getTeamsInfo(leagueId) {
	const response = await fetch(TEAMS_INFO_URL + leagueId, RAPID_API_REQUEST_OPTIONS).catch(e => {
		throw new Error(e.message);
	});

	if (response.ok) {
		const data = await response.json();
		return data.api.teams;
	} else {
		throw new Error();
	}
}

export { getCurrentLeagues, getSchedule, getTeamsInfo };
