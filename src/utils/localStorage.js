function getLocalLeagues() {
	return new Promise(resolve => {
		setTimeout(() => {
			let localLeagues = JSON.parse(localStorage.getItem('leagues'));
			if (!localLeagues || localLeagues.length === 0) {
				resolve({ leagues: null });
			} else {
				let today = new Date(); //  '2021-04-03T11:30:00Z'
				localLeagues.forEach(league => {
					if (league.matches.some(match => new Date(match.utcDate) < today)) {
						resolve({ localLeagues, outOfDate: true });
					} else {
						resolve({ localLeagues, outOfDate: false });
					}
				});
			}
		});
	});
}

async function writeLocalLeagues(leagues) {
	if (leagues.length === 4 && leagues.every(league => league && !league.loading)) {
		let arr = [];
		leagues.forEach(l => arr.push(l.toJSON()));
		localStorage.setItem('leagues', JSON.stringify(arr));
	}
}

export { getLocalLeagues, writeLocalLeagues };
