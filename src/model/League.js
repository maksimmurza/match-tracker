class League {
	name;
	logoURL;
	matches;
	teams;
	status = 'checked';
	teamsShowed;

	constructor(name, country) {
		this.name = name;
		this.country = country;
	}
}

export default League;