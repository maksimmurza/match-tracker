class League {
	#name;
	#country;
	#logo;
	#matches;
	#teams;
	#status = 'checked';
	#teamsShowed;
	#activeTeams;

	constructor(name, country) {
		this.#name = name;
		this.#country = country;
	}

	toJSON() {
		return {
			name: this.#name,
			country: this.#country,
			logo: this.#logo,
			matches: this.#matches,
			teams: this.#teams,
			status: this.#status,
			teamsShowed: this.#teamsShowed,
			activeTeams: this.#activeTeams,
		};
	}

	get name() {
		return this.#name;
	}

	set name(name) {
		if (!/\d/.test(name)) {
			this.#name = name;
		} else {
			throw new Error('Incorect symbols in league name');
		}
	}

	get country() {
		return this.#country;
	}

	set country(country) {
		if (!/\d/.test(country)) {
			this.#country = country;
		} else {
			throw new Error('Incorect symbols in league country');
		}
	}

	get logo() {
		return this.#logo;
	}

	set logo(logo) {
		if (/^https:/.test(logo) && /png$/.test(logo)) {
			this.#logo = logo;
		} else {
			throw new Error('Incorect link to the logotype');
		}
	}

	get matches() {
		return this.#matches;
	}

	set matches(matches) {
		if (Array.isArray(matches)) {
			if (
				matches.length === 0 ||
				matches.every(match => ['utcDate', 'homeTeam', 'awayTeam'].every(prop => prop in match))
			) {
				this.#matches = matches;
			} else {
				throw new Error('Incorrect properties in "matches"');
			}
		} else {
			throw new Error('Incorrect type of property "matches"');
		}
	}

	get teams() {
		return this.#teams;
	}

	set teams(teams) {
		if (teams.length > 1 && teams.every(team => ['name', 'logo'].every(prop => prop in team))) {
			this.#teams = teams;
		} else {
			throw new Error('Incorrect type of property "teams"');
		}
	}

	get status() {
		return this.#status;
	}

	set status(status) {
		if (status === 'checked' || status === 'unchecked' || status === 'indeterminate') {
			this.#status = status;
		} else {
			throw new Error('Incorect league status');
		}
	}

	get teamsShowed() {
		return this.#teamsShowed;
	}

	set teamsShowed(teamsShowed) {
		if (typeof teamsShowed === 'number') {
			this.#teamsShowed = teamsShowed;
		} else {
			throw new Error('Incorect type of league property');
		}
	}

	get activeTeams() {
		return this.#activeTeams;
	}

	set activeTeams(activeTeams) {
		if (typeof activeTeams === 'number') {
			this.#activeTeams = activeTeams;
		} else {
			throw new Error('Incorect type of league property');
		}
	}
}

export default League;
