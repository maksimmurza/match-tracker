import { LEAGUES_KEYS } from './requestOptions';

function getLocalLeagues() {
	return new Promise(resolve => {
		setTimeout(() => {
			let localLeagues = JSON.parse(localStorage.getItem('leagues'));
			if (!localLeagues || localLeagues.length === 0) {
				resolve({ leagues: null });
			} else {
				if (
					localLeagues.some(league =>
						league.matches.some(match => {
							const now = new Date();
							const matchBegins = new Date(match.utcDate);
							const matchEnds = matchBegins.addHours(1.5);
							return now > matchEnds;
						})
					)
				) {
					resolve({ localLeagues, outOfDate: true });
				} else {
					resolve({ localLeagues, outOfDate: false });
				}
			}
		});
	});
}

function writeLocalLeagues(leagues) {
	setTimeout(() => {
		if (leagues.length === LEAGUES_KEYS.length && leagues.every(league => league && !league.loading)) {
			const leaguesJSON = leagues.map(league => league.toJSON());
			localStorage.setItem('leagues', JSON.stringify(leaguesJSON));
		}
	}, 0);
}

export { getLocalLeagues, writeLocalLeagues };
