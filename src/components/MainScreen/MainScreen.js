import React from 'react';
import MatchList from './MatchList/MatchList';
import SelectionArea from './SelectionArea/SelectionArea';
import './MainScreen.css';
import { LocaleContext } from '../../context/LocaleContext';
import { writeLocalLeagues } from '../../utils/localStorage';
import { Grid, Select, Button, SidebarPushable, SidebarPusher, Input } from 'semantic-ui-react';
import MobileSidebar from './MobileSidebar/MobileSideBar';
import GoogleAuthButton from './GoogleAuthButton/GoogleAuthButton';
import notificationable from '../Notification/Notification';
import PropTypes from 'prop-types';
import League from '../../model/League';

class MainScreen extends React.Component {
	constructor(props) {
		super(props);
		this.showNotification = props.showNotification;
		this.leagues = props.leagues;
		this.state = {
			quantity: 15,
			locale: 'ru',
			sidebarVisible: false,
		};
	}

	onChangeLeague = (leagueName, newLeagueStatus) => {
		const league = this.leagues.find(league => league.name === leagueName);
		league.status = newLeagueStatus;

		if (newLeagueStatus === 'checked') {
			league.teamsShowed = league.teams.length;
			league.teams.forEach(team => (team.show = true));
		} else {
			league.teamsShowed = 0;
			league.teams.forEach(team => (team.show = false));
		}

		writeLocalLeagues(this.leagues);
		this.forceUpdate();
	};

	onChangeTeam = (teamName, leagueName, newTeamStatus) => {
		const league = this.leagues.find(league => league.name === leagueName);
		const team = league.teams.find(team => team.name === teamName);
		team.show = newTeamStatus !== 'unchecked' && true;

		if (newTeamStatus === 'unchecked') {
			league.status = --league.teamsShowed === 0 ? 'unchecked' : 'indeterminate';
		} else {
			league.status = ++league.teamsShowed === league.activeTeams ? 'checked' : 'indeterminate';
		}

		writeLocalLeagues(this.leagues);
		this.forceUpdate();
	};

	sidebarToggle = () => {
		this.setState(state => ({ sidebarVisible: !state.sidebarVisible }));
	};

	setLocale = (event, selected) => {
		this.setState({ locale: selected.value });
	};

	render() {
		return (
			<div className="schedule">
				<SidebarPushable>
					<MobileSidebar sidebarVisible={this.state.sidebarVisible} onHide={this.sidebarToggle}>
						<SelectionArea
							leagues={this.leagues}
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
										leagues={this.leagues.filter(value => value)}
										quantity={this.state.quantity}
										todayDate={new Date()}
									/>
								</LocaleContext.Provider>
							</Grid.Column>

							<Grid.Column className="controls" computer={5} tablet={6} only="computer tablet">
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
									leagues={this.leagues}
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

MainScreen.propTypes = {
	leagues: PropTypes.arrayOf(PropTypes.instanceOf(League)),
};

export default notificationable(MainScreen);
