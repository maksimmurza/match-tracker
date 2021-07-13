import React from 'react';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import './LeagueTab.css';
import PropTypes from 'prop-types';
import League from '../../../model/League';

class LeagueTab extends React.Component {
	handleChange = event => {
		event.stopPropagation();
		let league = this.props.league;
		league.teams.forEach(team => {
			if (league.status === 'unchecked') {
				team.show = true;
				league.teamsShowed = league.activeTeams;
			} else {
				team.show = false;
				league.teamsShowed = 0;
			}
		});
		if (league.status === 'unchecked') league.status = 'checked';
		else league.status = 'unchecked';

		this.props.onChangeLeague(league);
	};

	render() {
		return !this.props.league ? (
			<Icon name="exclamation"></Icon>
		) : this.props.league.status !== 'loading' ? (
			<div className="league-tab" title={`${this.props.league.name}`}>
				<Checkbox
					onChange={this.handleChange}
					checked={this.props.league.status === 'checked'}
					indeterminate={this.props.league.status === 'indeterminate'}
					data-testid="leagueCheckbox"
				/>
				<img src={this.props.league.logo} className="league-tab-logo"></img>
			</div>
		) : (
			<Loader size="tiny" active></Loader>
		);
	}
}

LeagueTab.propTypes = {
	league: PropTypes.instanceOf(League),
	status: PropTypes.oneOf(['checked', 'unchecked', 'indeterminate']),
	onChangeLeague: PropTypes.func,
};

export default LeagueTab;
