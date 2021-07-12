import React from 'react';
import { getLocalLeagues, writeLocalLeagues } from '../../utils/localStorage';
import { getSchedule, getCurrentLeagues, getTeamsInfo } from '../../utils/fetchData';
import League from '../../model/League';
import req from '../../utils/requestOptions';
import stringSimilarity from 'string-similarity';
import notificationable from '../Notification/Notification';
import { Grid, Icon, Message } from 'semantic-ui-react';

class DataProvider extends React.Component {
	constructor(props) {
		super(props);
		this.showNotification = props.showNotification;
		this.state = {
			leagues: [],
			message: '',
		};
	}

	componentDidMount() {
		this.setState({ message: 'Checking local storage...' });
		getLocalLeagues().then(({ localLeagues, outOfDate }) => {
			if (localLeagues && !outOfDate) {
				localLeagues.forEach(league => {
					this.resolveTeamNames(league);
				});
				this.setState({ leagues: localLeagues });
				this.showNotification('', 'Loaded from local storage');
			} else {
				this.setState({
					message: 'Local schedule is empty or out of date. Fetching data from API...',
				});
				this.fetchData(localLeagues)
					.then(() => {
						writeLocalLeagues(this.state.leagues);
						this.showNotification('', 'Loaded from API');
					})
					.catch(e => {
						console.log('Problems while fetching data from APIs after mounting component');
						console.log(e);
					});
			}
		});
	}

	async fetchData(localLeagues) {
		// get list of current leagues for using id's in future requests
		let currentLeagues = await getCurrentLeagues().catch(e => {
			throw e;
		});

		const fetchProcesses = [];

		// for all leagues that we "track"
		for (let key of req.footballData.leaguesKeys) {
			let league = new League(key);
			this.setState(state => ({ leagues: [...state.leagues, league] }));

			const process = async () => {
				// get live and scheduled matches
				const [live, schedule] = await Promise.all([
					getSchedule(key, req.footballData.liveFilter),
					getSchedule(key, req.footballData.scheduledFilter),
				]);

				if (!live || !schedule) {
					this.setState(state => {
						let leagues = state.leagues.map(value => {
							return value?.id === league.id ? null : value;
						});
						return { leagues: [...leagues] };
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
						(l.name === league.name ||
							(league.name === 'European Championship' && l.name === 'Euro Championship')) &&
						(l.country === league.country || l.country === 'World' || l.country === 'Europe')
					) {
						league.logo = l.logo;

						let teams = await getTeamsInfo(l.league_id).catch(e => {
							throw e;
						});

						teams.forEach(team => {
							team.show = true;
							team.leagueName = schedule.competition.name;
						});
						league.teams = teams;

						this.resolveTeamNames(league);
						league.activeTeams = teams.filter(team =>
							league.matches.some(match => {
								return team.name === match.homeTeam.name || team.name === match.awayTeam.name;
							})
						).length;
						league.teamsShowed = league.activeTeams;

						if (
							localLeagues &&
							localLeagues.some(l => l.id === league.id && l.name === league.name)
						) {
							const localLeague = localLeagues.find(l => l.id === league.id);
							league.status = localLeague.status;
							league.teams.forEach(team => {
								const localTeam = localLeague.teams.find(
									t => t.id === team.id && t.name === team.name
								);
								if (localTeam) {
									team.show = localTeam.show;
								}
							});
						} else {
							league.status = 'checked';
						}

						this.setState(state => {
							let leagues = state.leagues.map(value => {
								return value?.id === league.id ? league : value;
							});
							return { leagues: [...leagues] };
						});
					}
				}
			};

			fetchProcesses.push(process());
		}

		await Promise.all(fetchProcesses);
	}

	resolveTeamNames(league) {
		league.matches.length > 0 &&
			league.matches.forEach(match => {
				let arr = [];
				const separators = /United|City|FC|hampton/;
				league.teams.forEach(team => {
					arr.push(team.name);
				});

				if (match.homeTeam.name) {
					const { ratings: bestMatches, bestMatchIndex } = stringSimilarity.findBestMatch(
						match.homeTeam.name,
						arr
					);
					if (bestMatches[bestMatchIndex].rating > 0.75) {
						match.homeTeam = league.teams[bestMatchIndex];
					} else {
						const { ratings: bestMatches, bestMatchIndex } = stringSimilarity.findBestMatch(
							match.homeTeam.name.split(separators).join(''),
							arr
						);
						if (bestMatches[bestMatchIndex].rating > 0.38) {
							match.homeTeam = league.teams[bestMatchIndex];
						}
					}
				}

				if (match.awayTeam.name) {
					const { ratings: bestMatches, bestMatchIndex } = stringSimilarity.findBestMatch(
						match.awayTeam.name,
						arr
					);
					if (bestMatches[bestMatchIndex].rating > 0.75) {
						match.awayTeam = league.teams[bestMatchIndex];
					} else {
						const { ratings: bestMatches, bestMatchIndex } = stringSimilarity.findBestMatch(
							match.awayTeam.name.split(separators).join(''),
							arr
						);
						if (bestMatches[bestMatchIndex].rating > 0.38) {
							match.awayTeam = league.teams[bestMatchIndex];
						}
					}
				}
			});
	}

	render() {
		if (
			this.state.leagues.length < req.footballData.leaguesKeys.length &&
			!this.state.leagues.some(l => l?.matches)
		) {
			return (
				<Grid centered>
					<Grid.Column className="message-wrapper" computer={8} tablet={10} mobile={14}>
						<Message icon>
							<Icon name="circle notched" loading />
							<Message.Content>
								<Message.Header>Just one second</Message.Header>
								<p>{this.state.message}</p>
							</Message.Content>
						</Message>
					</Grid.Column>
				</Grid>
			);
		} else {
			return this.props.render(this.state.leagues);
		}
	}
}

export default notificationable(DataProvider);
