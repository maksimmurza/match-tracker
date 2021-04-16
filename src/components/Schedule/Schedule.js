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
import { Grid, Select, Button, SidebarPushable, SidebarPusher } from 'semantic-ui-react';
import MobileSidebar from '../MobileSidebar/MobileSideBar';

class Schedule extends React.Component {
	constructor(props) {
		super(props);
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
				this.fetchData().catch(e => {
					console.log('Problems while fetching data from APIs after mounting component');
					console.log(e);
				});
			});
	}

	async fetchData() {
		// get list of current leagues for using id's in future requests
		let currentLeagues = await getCurrentLeagues().catch(e => {
			throw e;
		});

		// for all leagues that we "track"
		for (let key of req.footballData.leaguesKeys) {
			let live;
			let schedule;

			// get live and scheduled matches
			try {
				live = await getSchedule(key, req.footballData.liveFilter);
				schedule = await getSchedule(key, req.footballData.scheduledFilter);
			} catch (e) {
				this.setState(state => ({ leagues: [...state.leagues, null] }));
				continue;
			}

			// merge all matches
			live.matches.forEach(liveMatch => {
				schedule.matches.unshift(liveMatch);
			});

			let league = new League(schedule.competition.name, schedule.competition.area.name);
			league.matches = schedule.matches;

			for (let l of currentLeagues) {
				if (
					l.name === league.name &&
					(l.country === league.country || l.country === ('World' || 'Europe'))
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

					this.setState(state => ({
						leagues: [...state.leagues, league],
					}));
				}
			}
		}

		writeLocalLeagues(this.state.leagues);
	}

	resolveTeamNames(league) {
		// finding logo for teams from schedule comparing names
		league.matches.forEach(match => {
			let arr = [];
			league.teams.forEach(team => {
				arr.push(team.name);
			});

			match.homeTeam =
				league.teams[
					stringSimilarity.findBestMatch(
						match.homeTeam.name.split('hampton').join(''),
						arr
					).bestMatchIndex
				];
			match.awayTeam =
				league.teams[
					stringSimilarity.findBestMatch(
						match.awayTeam.name.split('hampton').join(''),
						arr
					).bestMatchIndex
				];
		});
	}

	onChangeLeague = alreadyChangedLeague => {
		this.setState(state => {
			let leagues = state.leagues.map(value => {
				return value?.name === alreadyChangedLeague.name ? alreadyChangedLeague : value;
			});
			return { ...leagues };
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
		console.log(selected);
		this.setState({ locale: selected.value });
	};

	render() {
		// loading
		if (this.state.leagues.length === 0) {
			return (
				<div className="message-wrapper">
					<div className="ui icon message">
						<i className="notched circle loading icon"></i>
						<div className="content">
							<div className="header">Just one second</div>
							<p>{this.state.message}</p>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="schedule">
					<SidebarPushable>
						<MobileSidebar sidebarVisible={this.state.sidebarVisible} onHide={this.sidebarToggle}>
							<SelectionArea
								leagues={this.state.leagues}
								onChangeLeague={this.onChangeLeague}
								onChangeTeam={this.onChangeTeam}></SelectionArea>
						</MobileSidebar>
						<SidebarPusher dimmed={this.state.sidebarVisible}>
							<Grid stackable centered>
								{/* <Grid.Column only="mobile" className="sidebar-toggle"> */}
								<Grid.Column only="mobile">
									<div className="sidebar-toggle">
										<Button
											icon="content"
											style={{ backgroundColor: 'transparent' }}
											onClick={this.sidebarToggle}></Button>
										<Select
											className="locale-input"
											onChange={this.setLocale}
											value={this.state.locale}
											style={{ float: 'right' }}
											options={[
												{ key: 'en', value: 'en', text: 'en' },
												{ key: 'ru', value: 'ru', text: 'ru' },
											]}
										/>
									</div>
								</Grid.Column>
								{/* </Grid.Column> */}
								<Grid.Column computer={9} tablet={10} mobile={16}>
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
											className="locale-input"
											onChange={this.setLocale}
											value={this.state.locale}
											options={[
												{ key: 'en', value: 'en', text: 'en' },
												{ key: 'ru', value: 'ru', text: 'ru' },
											]}
										/>
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
