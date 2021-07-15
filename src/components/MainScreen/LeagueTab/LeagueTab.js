import React from 'react';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import './LeagueTab.css';
import PropTypes from 'prop-types';
import League from '../../../model/League';

class LeagueTab extends React.Component {
	handleChange = event => {
		event.stopPropagation();
		const newLeagueStatus = `${this.props.league.status !== 'unchecked' ? 'un' : ''}checked`;
		this.props.onChangeLeague(this.props.league.name, newLeagueStatus);
	};

	render() {
		const tabLoader = <Loader size="tiny" active></Loader>;
		const unavailableTabIcon = <Icon name="exclamation"></Icon>;
		const tabContent = (
			<div className="league-tab" title={`${this.props.league.name}`}>
				<Checkbox
					onChange={this.handleChange}
					checked={this.props.league.status === 'checked'}
					indeterminate={this.props.league.status === 'indeterminate'}
					data-testid="leagueCheckbox"
				/>
				<img src={this.props.league.logo} className="league-tab-logo"></img>
			</div>
		);

		return !this.props.league
			? unavailableTabIcon
			: this.props.league.status === 'loading'
			? tabLoader
			: tabContent;
	}
}

LeagueTab.propTypes = {
	league: PropTypes.instanceOf(League),
	onChangeLeague: PropTypes.func,
};

export default LeagueTab;
