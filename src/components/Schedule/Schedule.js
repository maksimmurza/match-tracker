import React from 'react';
import MatchList from './MatchList/MatchList';
import SelectionArea from './SelectionArea/SelectionArea';
import './Schedule.css';
import League from '../../model/League';
import req from '../../utils/requestOptions';
import stringSimilarity from 'string-similarity';
import { LocaleContext } from './LocaleContext';
import { getSchedule, getCurrentLeagues, getTeamsInfo } from '../../utils/fetch';
import { getLocalLeagues, writeLocalLeagues } from '../../utils/local';
import {
	Grid,
	Select,
	Button,
	SidebarPushable,
	SidebarPusher,
	Icon,
	Message,
	Input,
} from 'semantic-ui-react';
import MobileSidebar from '../MobileSidebar/MobileSideBar';
import GoogleAuthButton from '../GoogleAuthButton/GoogleAuthButton';
import notificationable from '../Notification/Notification';

class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.showNotification = props.showNotification;
		this.state = {
			leagues: [],
			quantity: 15,
			locale: 'ru',
			message: '',
			sidebarVisible: false,
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
						console.log('created in fetch data', this.state.leagues);
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

	onChangeLeague = alreadyChangedLeague => {
		this.setState(
			state => {
				let leagues = state.leagues.map(value => {
					return value?.name === alreadyChangedLeague.name ? alreadyChangedLeague : value;
				});
				return { leagues: [...leagues] };
			},
			() => {
				writeLocalLeagues(this.state.leagues);
			}
		);
	};

	onChangeTeam = (changedTeam, newTeamStatus) => {
		let leagues = this.state.leagues;
		let changedLeague = leagues.find(league => league.name === changedTeam.leagueName);
		changedTeam.show = newTeamStatus !== 'unchecked' && true;
		changedLeague.teams.map(team => (team.name === changedTeam.name ? changedTeam : team));

		if (newTeamStatus === 'unchecked') {
			changedLeague.status = --changedLeague.teamsShowed === 0 ? 'unchecked' : 'indeterminate';
		} else {
			changedLeague.status =
				++changedLeague.teamsShowed === changedLeague.activeTeams ? 'checked' : 'indeterminate';
		}

		this.onChangeLeague(changedLeague);
	};

	sidebarToggle = () => {
		this.setState(state => ({ sidebarVisible: !state.sidebarVisible }));
	};

	setLocale = (event, selected) => {
		this.setState({ locale: selected.value });
	};

	render() {
		// loading
		if (this.state.leagues.length < 4 && !this.state.leagues.some(l => l?.matches)) {
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
			return (
				<div className="schedule">
					<SidebarPushable>
						<MobileSidebar sidebarVisible={this.state.sidebarVisible} onHide={this.sidebarToggle}>
							<SelectionArea
								leagues={this.state.leagues}
								onChangeLeague={this.onChangeLeague}
								onChangeTeam={this.onChangeTeam}
								style={{ height: '100%' }}></SelectionArea>
						</MobileSidebar>
						<SidebarPusher dimmed={this.state.sidebarVisible}>
							<Grid stackable centered>
								<Grid.Column only="mobile" id="mobile-layout">
									<div className="mobile-bar">
										<Button
											icon="content"
											className="toggle-sidebar"
											style={{ backgroundColor: 'transparent' }}
											onClick={this.sidebarToggle}></Button>
										<div className="settings-wrapper">
											<Input
												value={this.state.quantity}
												onChange={e => this.setState({ quantity: e.target.value })}
												type="number"
												title="Number of upcoming matches with selected teams"
												icon="filter"
												iconPosition="left"
												className="filter"
											/>
											<Select
												style={{ marginRight: '10px' }}
												className="locale-input"
												onChange={this.setLocale}
												value={this.state.locale}
												options={[
													{ key: 'en', value: 'en', text: 'en' },
													{ key: 'ru', value: 'ru', text: 'ru' },
												]}
											/>
											<GoogleAuthButton size={'small'}></GoogleAuthButton>
										</div>
									</div>
								</Grid.Column>
								<Grid.Column computer={9} tablet={10} mobile={16} id="match-list-column">
									<LocaleContext.Provider value={this.state.locale}>
										<MatchList
											leagues={this.state.leagues.filter(value => value)}
											quantity={this.state.quantity}
											todayDate={new Date()}
										/>
									</LocaleContext.Provider>
								</Grid.Column>

								<Grid.Column
									className="controls"
									computer={5}
									tablet={6}
									only="computer tablet">
									<div className="settings-wrapper">
										<Input
											value={this.state.quantity}
											onChange={e => this.setState({ quantity: e.target.value })}
											type="number"
											title="Number of upcoming matches with selected teams"
											icon="filter"
											iconPosition="left"
											className="filter"
										/>
										<Select
											style={{ marginRight: '10px' }}
											className="locale-input"
											onChange={this.setLocale}
											value={this.state.locale}
											options={[
												{ key: 'en', value: 'en', text: 'en' },
												{ key: 'ru', value: 'ru', text: 'ru' },
											]}
										/>
										<GoogleAuthButton></GoogleAuthButton>
									</div>
									<SelectionArea
										leagues={this.state.leagues}
										onChangeLeague={this.onChangeLeague}
										onChangeTeam={this.onChangeTeam}></SelectionArea>
								</Grid.Column>
							</Grid>
						</SidebarPusher>
					</SidebarPushable>
				</div>
			);
		}
	}
}
export default notificationable(Schedule);
