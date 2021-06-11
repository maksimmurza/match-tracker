import League from '../model/League';

function getLocalLeagues() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let leaguesLocal = JSON.parse(localStorage.getItem('leagues'));
			if (!leaguesLocal || leaguesLocal.length === 0) {
				reject();
			} else {
				let today = new Date(); //  '2021-04-03T11:30:00Z'
				leaguesLocal.forEach(league => {
					if (league.matches.some(match => new Date(match.utcDate) < today)) reject();
				});

				leaguesLocal.map(l => {
					let league = new League(l.id);
					league.name = l.name;
					league.country = l.country;
					league.logo = l.logo;
					league.matches = l.matches;
					league.teams = l.teams;
					league.status = l.status;
					league.teamsShowed = l.teamsShowed;
					return league;
				});
				resolve(leaguesLocal);
			}
		});
	});
}

function writeLocalLeagues(leagues) {
	if (leagues.length === 4 && leagues.every(league => league && league.status !== 'loading')) {
		let arr = [];
		leagues.forEach(l => arr.push(l.toJSON()));
		localStorage.setItem('leagues', JSON.stringify(arr));
	}
}

export { getLocalLeagues, writeLocalLeagues };
