import { makeObservable, observable, action, reaction } from 'mobx';
import { getCurrentLeagues, getSchedule, getTeamsInfo } from '../utils/fetchData';
import { writeLocalLeagues } from '../utils/localStorage';
import req from '../utils/requestOptions';
import League from './League';

export default class LeaguesStore {
	leagues = [];

	constructor() {
		makeObservable(this, {
			leagues: observable,
			getLeaguesFromLocal: action,
			getLeaguesFromAPI: action,
		});
	}

	async getLeaguesFromLocal(localLeagues) {
		this.leagues = [];
		localLeagues.forEach(l => {
			let league = new League(l.id);
			league.name = l.name;
			league.country = l.country;
			league.logo = l.logo;
			league.matches = l.matches;
			league.matches.forEach(match => (match.leagueLogo = league.logo));
			league.teams = l.teams;
			league.resolveTeamsNames();
			reaction(
				() => league.status,
				() => writeLocalLeagues(this.leagues)
			);
			league.loading = false;
			this.leagues.push(league);
		});
	}

	async getLeaguesFromAPI(localLeagues) {
		// get list of current leagues for using id's in future requests
		let currentLeagues = await getCurrentLeagues().catch(e => {
			throw e;
		});

		const fetchProcesses = [];

		// for all leagues that we "track"
		for (let key of req.footballData.leaguesKeys) {
			let league = new League(key);
			reaction(
				() => league.status,
				() => writeLocalLeagues(this.leagues)
			);
			this.leagues.push(league);

			const process = async () => {
				// get live and scheduled matches
				const [live, schedule] = await Promise.all([
					getSchedule(key, req.footballData.liveFilter),
					getSchedule(key, req.footballData.scheduledFilter),
				]);

				if (!live || !schedule) {
					this.leagues.map(value => {
						return value?.id === league.id ? null : value;
					});
					return;
				}

				// merge all matches
				live.matches.forEach(liveMatch => {
					schedule.matches.unshift(liveMatch);
				});

				league.name = schedule.competition.name;
				league.country = schedule.competition.area.name;
				league.matches = schedule.matches;

				for (let l of currentLeagues) {
					if (
						l.name === league.name &&
						(l.country === league.country || l.country === 'World' || l.country === 'Europe')
					) {
						league.logo = l.logo;
						league.matches.forEach(match => (match.leagueLogo = league.logo));

						let teams = await getTeamsInfo(l.league_id).catch(e => {
							throw e;
						});

						teams.forEach(team => {
							team.show = true;
							team.leagueName = schedule.competition.name;
						});
						league.teams = teams;

						league.resolveTeamsNames(league);

						if (
							localLeagues &&
							localLeagues.some(l => l.id === league.id && l.name === league.name)
						) {
							const localLeague = localLeagues.find(l => l.id === league.id);
							league.teams.forEach(team => {
								const localTeam = localLeague.teams.find(
									t => t.id === team.id && t.name === team.name
								);
								if (localTeam) {
									team.show = localTeam.show;
								}
							});
						}

						league.loading = false;
					}
				}
			};

			fetchProcesses.push(process());
		}

		await Promise.all(fetchProcesses);
	}
}
