import { makeObservable, observable, action } from 'mobx';

export default class Team {
	id;
	name = '';
	country = '';
	logo = '';
	leagueName = '';
	show = true;
	hasMatches = false;

	constructor(id, name, country, logo, leagueName, show) {
		this.id = id;
		this.name = name;
		this.country = country;
		this.logo = logo;
		this.leagueName = leagueName;
		if (show !== undefined) {
			this.show = show;
		}
		makeObservable(this, {
			id: observable,
			name: observable,
			country: observable,
			logo: observable,
			leagueName: observable,
			show: observable,
			hasMatches: observable,
			resolveMatches: action,
			toggleTeamVisibility: action,
		});
	}

	toggleTeamVisibility() {
		this.show = !this.show;
		this.writeLeaguesLocal();
	}

	resolveMatches(matches) {
		this.hasMatches = matches.some(m => m.homeTeam === this || m.awayTeam === this);
	}
}
