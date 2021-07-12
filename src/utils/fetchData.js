import req from './requestOptions';

async function getCurrentLeagues() {
	let source = req.rapidApi;
	const response = await fetch(source.currentSeasonLeaguesURL, source.requestOptions).catch(e => {
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
	let source = req.footballData;
	let response, data;

	response = await fetch(source.leaguesBaseURL + leagueKey + filter, source.requestOptions).catch(error => {
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
	let source = req.rapidApi;
	const response = await fetch(source.leaguesBaseURL + leagueId, source.requestOptions).catch(e => {
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
