import React from 'react';
import { Tab, Placeholder, Message } from 'semantic-ui-react';
import LeagueTab from '../LeagueTab/LeagueTab';
import TeamCheckbox from '../TeamCheckbox/TeamCheckbox';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

function SelectionArea({ leagues }) {
	let tabs = [];
	const failureMessage = (
		<Message warning>
			<Message.Header>Receiving information failed</Message.Header>
			<p>
				There have been several attempts to fetch information from API. All them failed. Check browser
				console.
			</p>
		</Message>
	);
	const teamsPlaceholder = (
		<Placeholder fluid>{new Array(20).fill(<Placeholder.Line length="full" />)}</Placeholder>
	);

	leagues.forEach(league => {
		const activeTeams = league?.teams
			?.filter(team => team.hasMatches)
			.map(team => <TeamCheckbox key={team.id} team={team} />);
		const inactiveTeams = league?.teams
			?.filter(team => !team.hasMatches)
			.map(team => <TeamCheckbox key={team.id} team={team} />);
		const teamList = activeTeams.concat(inactiveTeams);

		tabs.push({
			menuItem: {
				key: league?.id,
				content: <LeagueTab league={league}></LeagueTab>,
			},
			render: () => (
				<StyledTabPane>
					{teamList.length > 0 ? teamList : league?.loading ? teamsPlaceholder : failureMessage}
				</StyledTabPane>
			),
		});
	});

	return <StyledTab panes={tabs} />;
}

const StyledTab = styled(Tab)`
	display: flex;
	flex-direction: column;
	overflow: auto;
	& > .ui.attached.tabular.menu {
		overflow-y: auto !important;
		border-bottom: none !important;
		position: relative;
		flex-shrink: 0;
	}
	& > .ui.attached.tabular.menu > a:not(.active) {
		border-bottom: 1px solid #d4d4d5;
	}
	& > .ui.attached.tabular.menu::after {
		visibility: visible !important;
		content: ' ';
		flex-grow: 2;
		height: auto;
		border-bottom: 1px solid #d4d4d5;
	}
	& > .ui.attached.tabular.menu::-webkit-scrollbar {
		height: 8px;
		cursor: pointer;
	}
	& > .ui.attached.tabular.menu::-webkit-scrollbar-track {
		background-color: white;
		border-left: 1px solid #d4d4d5;
		border-right: 1px solid #d4d4d5;
	}
	& > .ui.tabular.menu .active.item {
		margin-bottom: initial;
	}
	@media (max-width: 767px) {
		height: 100%;
		#bar + & {
			display: none;
		}
	}
}`;

const StyledTabPane = styled(Tab.Pane)`
	overflow-y: auto;
	@media (max-width: 767px) {
		flex-grow: 1;
	}
`;

SelectionArea.propTypes = {
	leagues: MobxPropTypes.observableArrayOf(MobxPropTypes.observableObject),
};

export default observer(SelectionArea);
