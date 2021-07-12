import League from '../model/League';

function getLocalLeagues() {
	return new Promise(resolve => {
		setTimeout(() => {
			let localLeagues = JSON.parse(localStorage.getItem('leagues'));
			if (!localLeagues || localLeagues.length === 0) {
				resolve({ leagues: null });
			} else {
				let today = new Date(); //  '2021-04-03T11:30:00Z'
				localLeagues.forEach(league => {
					if (league.matches.some(match => new Date(match.utcDate) < today))
						resolve({ localLeagues, outOfDate: true });
				});

				try {
					const leagues = [];
					localLeagues.forEach(l => {
						let league = new League(l.id);
						league.name = l.name;
						league.country = l.country;
						league.logo = l.logo;
						league.matches = l.matches;
						league.teams = l.teams;
						league.status = l.status;
						league.activeTeams = l.activeTeams;
						league.teamsShowed = l.teamsShowed;
						leagues.push(league);
					});
					resolve({ localLeagues: leagues, outOfDate: false });
				} catch (error) {
					resolve({ localLeagues, outOfDate: true });
				}
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
