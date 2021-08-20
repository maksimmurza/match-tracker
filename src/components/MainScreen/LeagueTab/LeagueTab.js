import React from 'react';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

const LeagueTab = ({ league }) => {
	return league.failed ? (
		<Icon name="exclamation" data-testid="league-tab-alert"></Icon>
	) : league.loading ? (
		<Loader size="tiny" active data-testid="league-tab-loader"></Loader>
	) : (
		<StyledLeagueTab title={league.name} data-testid="league-tab">
			<Checkbox
				onChange={event => {
					event.stopPropagation();
					league.toggleLeagueVisibility();
				}}
				checked={league.status === 'checked'}
				indeterminate={league.status === 'indeterminate'}
				data-testid="league-tab-checkbox"
			/>
			<StyledLeagueLogo src={league.logo} alt={`${league.name} logo`}></StyledLeagueLogo>
		</StyledLeagueTab>
	);
};

const StyledLeagueTab = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const StyledLeagueLogo = styled.img`
	box-sizing: content-box;
	padding-left: 1rem;
	width: 25px;
`;

LeagueTab.propTypes = {
	league: MobxPropTypes.observableObject,
	onChangeLeague: PropTypes.func,
};

export default observer(LeagueTab);
