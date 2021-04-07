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

async function getSchedule(leagueKey, filter) {
	let source = req.footballData;
	const response = await fetch(source.leaguesBaseURL + leagueKey + filter, source.requestOptions).catch(
		e => {
			throw new Error(e.message + ' (Possibly because of too much requets per minute');
		}
	);

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		throw new Error();
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
