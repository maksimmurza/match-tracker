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
	Dropdown,
	Message,
} from 'semantic-ui-react';
import MobileSidebar from '../MobileSidebar/MobileSideBar';
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '../../utils/authOptions';

class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.gapi = window.gapi;
		this.state = {
			user: null,
			isSignedIn: false,
			leagues: [],
			quantity: 15,
			locale: 'ru',
			message: '',
			sidebarVisible: false,
		};
	}

	componentDidMount() {
		this.setState({ message: 'Checking local storage...' });
		getLocalLeagues()
			.then(leagues => {
				leagues.forEach(league => {
					this.resolveTeamNames(league);
				});
				this.setState({ leagues: leagues });
			})
			.catch(() => {
				this.setState({
					message: 'Local schedule is empty or out of date. Fetching data from API...',
				});
				this.fetchData()
					.then(() => writeLocalLeagues(this.state.leagues))
					.catch(e => {
						console.log('Problems while fetching data from APIs after mounting component');
						console.log(e);
					});
			});

		this.authInit();
	}

	async fetchData() {
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

						league.status = 'checked';
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
		// finding logo for teams from schedule comparing names
		league.matches.length > 0 &&
			league.matches.forEach(match => {
				let arr = [];
				league.teams.forEach(team => {
					arr.push(team.name);
				});

				match.homeTeam.name
					? (match.homeTeam =
							league.teams[
								stringSimilarity.findBestMatch(
									match.homeTeam.name.split('hampton').join(''),
									arr
								).bestMatchIndex
							])
					: 'Home Team';
				match.awayTeam.name
					? (match.awayTeam =
							league.teams[
								stringSimilarity.findBestMatch(
									match.awayTeam.name.split('hampton').join(''),
									arr
								).bestMatchIndex
							])
					: 'Away Team';
			});
	}

	onChangeLeague = alreadyChangedLeague => {
		this.setState(state => {
			let leagues = state.leagues.map(value => {
				return value?.name === alreadyChangedLeague.name ? alreadyChangedLeague : value;
			});
			return { leagues: [...leagues] };
		});
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

	authInit = () => {
		this.gapi.load('client:auth2', async () => {
			await this.gapi.client.init({
				apiKey: API_KEY,
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				scope: SCOPES,
			});

			if (this.gapi.auth2.getAuthInstance().isSignedIn.get() === true) {
				this.setState({ isSignedIn: true });
				const profile = this.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
				this.setState({ user: profile });
			}
		});
	};

	handleAuthClick = () => {
		if (this.state.isSignedIn === true) {
			this.gapi.auth2
				.getAuthInstance()
				.signOut()
				.then(() => {
					this.setState({ user: null });
					this.setState({ isSignedIn: false });
				});
		} else {
			this.gapi.auth2
				.getAuthInstance()
				.signIn()
				.then(() => {
					const profile = this.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
					this.setState({ user: profile });
					this.setState({ isSignedIn: true });
				});
		}
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
								<Grid.Column only="mobile" id="mobile-bar">
									<div className="mobile-bar">
										<Button
											icon="content"
											style={{ backgroundColor: 'transparent' }}
											onClick={this.sidebarToggle}></Button>
										<div className="mobile-bar-buttons">
											<Select
												className="locale-input"
												onChange={this.setLocale}
												value={this.state.locale}
												style={{ marginBottom: 0 }}
												options={[
													{ key: 'en', value: 'en', text: 'en' },
													{ key: 'ru', value: 'ru', text: 'ru' },
												]}
											/>
											{this.state.isSignedIn === false ? (
												<Button primary onClick={this.handleAuthClick}>
													<Icon name="google"></Icon>
													Sign In
												</Button>
											) : (
												this.state.user && (
													<Button.Group color="blue">
														<Dropdown
															button
															pointing
															className="icon"
															labeled
															icon="google"
															text={this.state.user.getName()}>
															<Dropdown.Menu>
																<Dropdown.Item
																	onClick={this.handleAuthClick}
																	text="Sign Out"
																/>
															</Dropdown.Menu>
														</Dropdown>
													</Button.Group>
												)
											)}
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
									<Grid.Row>
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
										{this.state.isSignedIn === false ? (
											<Button primary onClick={this.handleAuthClick}>
												<Icon name="google"></Icon>
												Sign In
											</Button>
										) : (
											this.state.user && (
												<Button.Group color="blue">
													<Dropdown
														button
														pointing
														className="icon"
														labeled
														icon="google"
														text={this.state.user.getName()}>
														<Dropdown.Menu>
															<Dropdown.Item
																onClick={this.handleAuthClick}
																text="Sign Out"
															/>
														</Dropdown.Menu>
													</Dropdown>
												</Button.Group>
											)
										)}
									</Grid.Row>
									<Grid.Row>
										<SelectionArea
											leagues={this.state.leagues}
											onChangeLeague={this.onChangeLeague}
											onChangeTeam={this.onChangeTeam}></SelectionArea>
									</Grid.Row>
								</Grid.Column>
							</Grid>
						</SidebarPusher>
					</SidebarPushable>
				</div>
			);
		}
	}
}
export default Schedule;
