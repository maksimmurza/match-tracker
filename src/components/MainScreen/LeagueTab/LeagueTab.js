import React from 'react';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import './LeagueTab.css';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

class LeagueTab extends React.Component {
	handleChange = event => {
		event.stopPropagation();
		this.props.league.toggleVisibility();
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

		return !this.props.league ? unavailableTabIcon : this.props.league.loading ? tabLoader : tabContent;
	}
}

LeagueTab.propTypes = {
	league: MobxPropTypes.observableObject,
	onChangeLeague: PropTypes.func,
};

export default observer(LeagueTab);
