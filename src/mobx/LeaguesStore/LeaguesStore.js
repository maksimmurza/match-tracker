import { makeObservable, observable, action, reaction } from 'mobx';
import { getCurrentLeagues, getSchedule, getTeamsInfo } from '../../utils/fetchData';
import { writeLocalLeagues } from '../../utils/localStorage';
import { LEAGUES_KEYS, SCHEDULED_FILTER, LIVE_FILTER } from '../../utils/requestOptions';
import LeagueStore from '../LeagueStore/LeagueStore';
import TeamStore from '../TeamStore/TeamStore';

export default class LeaguesStore {
	leagues = [];

	constructor() {
		makeObservable(this, {
			leagues: observable,
			getLeaguesFromLocal: action,
			getLeaguesFromAPI: action,
			writeLeaguesLocal: action.bound,
		});
	}

	async getLeaguesFromLocal(localLeagues) {
		this.leagues = [];
		localLeagues.forEach(l => {
			let league = new LeagueStore(l.id);
			league.name = l.name;
			league.country = l.country;
			league.logo = l.logo;
			league.matches = l.matches;
			league.matches.forEach(match => (match.leagueLogo = league.logo));
			league.teams = l.teams.map(team => {
				let newTeam = new TeamStore(
					team.id,
					team.name,
					team.country,
					team.logo,
					team.leagueName,
					team.show
				);
				newTeam.writeLeaguesLocal = this.writeLeaguesLocal;
				return newTeam;
			});
			league.resolveTeamsNames();
			league.teams.forEach(team => team.resolveMatches(league.matches));
			league.resolveActiveTeams();
			reaction(
				() => league.status,
				() => this.writeLeaguesLocal()
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
		for (let key of LEAGUES_KEYS) {
			let league = new LeagueStore(key);
			reaction(
				() => league.status,
				() => writeLocalLeagues(this.leagues)
			);
			this.leagues.push(league);

			const process = async () => {
				// get live and scheduled matches
				const [live, schedule] = await Promise.all([
					getSchedule(key, LIVE_FILTER),
					getSchedule(key, SCHEDULED_FILTER),
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

						league.teams = teams.map(team => {
							let newTeam = new TeamStore(
								team.team_id,
								team.name,
								team.country,
								team.logo,
								schedule.competition.name
							);
							newTeam.writeLeaguesLocal = this.writeLeaguesLocal;
							return newTeam;
						});

						league.resolveTeamsNames();
						league.teams.forEach(team => team.resolveMatches(league.matches));
						league.resolveActiveTeams();
						reaction(
							() => league.status,
							() => this.writeLeaguesLocal()
						);

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

	writeLeaguesLocal() {
		writeLocalLeagues(this.leagues);
	}
}
