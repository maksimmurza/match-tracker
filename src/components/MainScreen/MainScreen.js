import React from 'react';
import MatchList from './MatchList/MatchList';
import SelectionArea from './SelectionArea/SelectionArea';
import './MainScreen.css';
import { LocaleContext } from '../../context/LocaleContext';
import { writeLocalLeagues } from '../../utils/localStorage';
import { Grid } from 'semantic-ui-react';
import notificationable from '../Notification/Notification';
import PropTypes from 'prop-types';
import ControlsBar from './ControlsBar/ControlsBar';
import MobileSidebar from '../MobileSidebar/MobileSidebar';
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

	setLocale = (event, selected) => {
		this.setState({ locale: selected.value });
	};

	setQuantity = event => {
		this.setState({ quantity: event.target.value });
	};

	sidebarToggle = () => {
		this.setState(state => ({ sidebarVisible: !state.sidebarVisible }));
	};

	render() {
		const matchList = (
			<MatchList
				leagues={this.leagues.filter(value => value)}
				quantity={this.state.quantity}
				todayDate={new Date()}
			/>
		);

		const selectionArea = (
			<SelectionArea
				leagues={this.leagues}
				onChangeLeague={this.onChangeLeague}
				onChangeTeam={this.onChangeTeam}
			/>
		);

		const controlsBar = (
			<ControlsBar
				values={{ quantity: this.state.quantity, locale: this.state.locale }}
				handlers={{
					setQuantity: this.setQuantity,
					setLocale: this.setLocale,
					sidebarToggle: this.sidebarToggle,
				}}
			/>
		);

		return (
			<div style={{ maxHeight: '100vh', overflow: 'auto' }}>
				<MobileSidebar
					sidebarContent={selectionArea}
					sidebarVisible={this.state.sidebarVisible}
					sidebarToggle={this.sidebarToggle}>
					<Grid stackable centered reversed="mobile">
						<Grid.Column computer={9} tablet={10} mobile={16} id="match-list-column">
							<LocaleContext.Provider value={this.state.locale}>
								{matchList}
							</LocaleContext.Provider>
						</Grid.Column>
						<Grid.Column computer={5} tablet={6} mobile={16} id="controls">
							{controlsBar}
							{selectionArea}
						</Grid.Column>
					</Grid>
				</MobileSidebar>
			</div>
		);
	}
}

MainScreen.propTypes = {
	leagues: PropTypes.arrayOf(PropTypes.instanceOf(League)),
	showNotification: PropTypes.func,
};

export default notificationable(MainScreen);
