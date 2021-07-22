import { makeObservable, observable, action, computed, toJS } from 'mobx';
import stringSimilarity from 'string-similarity';

export default class League {
	id;
	name = '';
	country = '';
	logo = '';
	teams = [];
	matches = [];
	activeTeams = 0;
	loading = true;

	constructor(id) {
		this.id = id;
		makeObservable(this, {
			id: observable,
			name: observable,
			country: observable,
			logo: observable,
			teams: observable.deep,
			matches: observable.deep,
			loading: observable,
			status: computed,
			resolveActiveTeams: action,
			teamsShowed: computed,
			resolveTeamsNames: action,
			toggleLeagueVisibility: action,
		});
	}

	resolveActiveTeams() {
		this.activeTeams = this.teams.filter(team => team.hasMatches).length;
	}

	get teamsShowed() {
		return this.teams.filter(team => team.show === true).length;
	}

	get status() {
		if (this.teamsShowed === 0) {
			return 'unchecked';
		} else if (this.teamsShowed >= this.activeTeams && this.teamsShowed !== 0) {
			return 'checked';
		} else {
			return 'indeterminate';
		}
	}

	resolveTeamsNames() {
		this.matches.length > 0 &&
			this.matches.forEach(match => {
				let arr = [];
				let separator = /United|City|FC|hampton|de|RCD/;
				this.teams.forEach(team => {
					arr.push(team.name);
				});

				for (let key in match) {
					if (key.includes('Team')) {
						if (match[key].name) {
							if (match[key].name.includes('Alavés')) {
								separator = /Deportivo/;
							} else if (match[key].name.includes('Espanyol')) {
								separator = /Barcelona/;
							}
							const { ratings: bestMatches, bestMatchIndex } = stringSimilarity.findBestMatch(
								match[key].name,
								arr
							);
							if (bestMatches[bestMatchIndex].rating > 0.75) {
								match[key] = this.teams[bestMatchIndex];
							} else {
								const {
									ratings: bestMatches,
									bestMatchIndex,
								} = stringSimilarity.findBestMatch(
									match[key].name.split(separator).join(''),
									arr
								);
								if (bestMatches[bestMatchIndex].rating > 0.38) {
									match[key] = this.teams[bestMatchIndex];
								}
							}
						}
					}
				}
			});
	}

	toggleLeagueVisibility = () => {
		if (this.status === 'unchecked') {
			this.teams.forEach(team => {
				if (this.matches.some(match => match.homeTeam === team || match.awayTeam === team)) {
					team.show = true;
				}
			});
		} else {
			this.teams.forEach(team => (team.show = false));
		}
	};

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			country: this.country,
			logo: this.logo,
			activeTeams: this.activeTeams,
			matches: toJS(this.matches),
			teams: toJS(this.teams),
		};
	}
}
