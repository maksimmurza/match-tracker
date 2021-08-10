import { LEAGUES_KEYS } from './requestOptions';

function getLocalLeagues() {
	return new Promise(resolve => {
		setTimeout(() => {
			const localLeagues = JSON.parse(localStorage.getItem('leagues'));
			const lastUpdate = localStorage.getItem('leaguesLastUpdate');
			const outOfDate =
				!lastUpdate ||
				new Date() - new Date(lastUpdate) > 1000 * 60 * 15 ||
				localLeagues?.some(league =>
					league.matches.some(match => {
						const now = new Date();
						const matchBegins = new Date(match.utcDate);
						const matchEnds = matchBegins.addHours(1.5);
						return now > matchEnds;
					})
				);
			if (!localLeagues || localLeagues.length !== LEAGUES_KEYS.length) {
				resolve({ leagues: null });
			} else {
				resolve({ localLeagues, outOfDate });
			}
		});
	});
}

function writeLocalLeagues(leagues, time) {
	setTimeout(() => {
		if (leagues.length === LEAGUES_KEYS.length && leagues.every(l => !l.failed && !l.loading)) {
			const leaguesJSON = leagues.map(league => league.toJSON());
			localStorage.setItem('leagues', JSON.stringify(leaguesJSON));
			if (time) {
				localStorage.setItem('leaguesLastUpdate', time.toISOString());
			}
		}
	}, 0);
}

export { getLocalLeagues, writeLocalLeagues };
