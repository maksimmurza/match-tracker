import req from './requestOptions';

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

async function writeLocalLeagues(leagues) {
	if (
		leagues.length === req.footballData.leaguesKeys.length &&
		leagues.every(league => league && !league.loading)
	) {
		let arr = [];
		leagues.forEach(l => arr.push(l.toJSON()));
		localStorage.setItem('leagues', JSON.stringify(arr));
	}
}

export { getLocalLeagues, writeLocalLeagues };
