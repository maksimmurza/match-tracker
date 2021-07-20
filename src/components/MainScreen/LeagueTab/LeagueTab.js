import React from 'react';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import './LeagueTab.css';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

class LeagueTab extends React.Component {
	constructor(props) {
		super(props);
		this.tabLoader = <Loader size="tiny" active></Loader>;
		this.unavailableTabIcon = <Icon name="exclamation"></Icon>;
	}

	handleChange = event => {
		event.stopPropagation();
		this.props.league.toggleVisibility();
	};

	render() {
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
			? this.unavailableTabIcon
			: this.props.league.loading
			? this.tabLoader
			: tabContent;
	}
}

LeagueTab.propTypes = {
	league: MobxPropTypes.observableObject,
	onChangeLeague: PropTypes.func,
};

export default observer(LeagueTab);
