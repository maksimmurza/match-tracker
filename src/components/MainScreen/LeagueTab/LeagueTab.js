import React from 'react';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import './LeagueTab.css';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

const LeagueTab = ({ league }) => {
	return !league ? (
		<Icon name="exclamation"></Icon>
	) : league.loading ? (
		<Loader size="tiny" active></Loader>
	) : (
		<div className="league-tab" title={league.name}>
			<Checkbox
				onChange={event => {
					event.stopPropagation();
					league.toggleLeagueVisibility();
				}}
				checked={league.status === 'checked'}
				indeterminate={league.status === 'indeterminate'}
				data-testid="leagueCheckbox"
			/>
			<img src={league.logo} className="league-tab-logo"></img>
		</div>
	);
};

LeagueTab.propTypes = {
	league: MobxPropTypes.observableObject,
	onChangeLeague: PropTypes.func,
};

export default observer(LeagueTab);
