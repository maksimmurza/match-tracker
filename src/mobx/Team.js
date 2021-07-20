import { makeObservable, observable, action, computed } from 'mobx';

export default class Team {
	id;
	name = '';
	country = '';
	logo = '';
	leagueName = '';
	show = true;
	matches = 0;

	constructor(id) {
		this.id = id;
		makeObservable(this, {
			id: observable,
			name: observable,
			country: observable,
			logo: observable,
			leagueName: observable,
			show: observable,
			matches: observable,
			toggleTeamVisibility: action,
		});
	}

	toggleTeamVisibility() {
		this.show = !this.show;
		this.writeLeaguesLocal();
	}
}
