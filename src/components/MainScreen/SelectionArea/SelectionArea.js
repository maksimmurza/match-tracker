import React from 'react';
import { Tab, Placeholder, Message } from 'semantic-ui-react';
import LeagueTab from '../LeagueTab/LeagueTab';
import TeamCheckbox from '../TeamCheckbox/TeamCheckbox';
import './SelectionArea.css';
import LocalErrorBoundary from '../../ErrorBoundaries/LocalErrorBoundary';
import { writeLocalLeagues } from '../../../utils/localStorage';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

function SelectionArea({ leagues }) {
	let panes = [];

	leagues.forEach(league => {
		let teams = [];

		league?.teams?.forEach(team => {
			if (
				league.teams.length <= 20 ||
				league.matches.some(m => m.homeTeam.name === team.name || m.awayTeam.name === team.name)
			) {
				teams.push(
					<TeamCheckbox
						key={team.name}
						team={team}
						toggleTeamVisibility={league.toggleTeamVisibility}
						writeLocal={() => {
							writeLocalLeagues(leagues);
						}}></TeamCheckbox>
				);
			}
		});

		panes.push({
			menuItem: {
				key: league?.id,
				content: (
					<LocalErrorBoundary>
						<LeagueTab league={league}></LeagueTab>
					</LocalErrorBoundary>
				),
			},
			render: () => (
				<Tab.Pane className="tab-content">
					{teams.length > 0 ? (
						teams
					) : league?.loading ? (
						<Placeholder fluid>
							{new Array(20).fill(<Placeholder.Line length="full" />)}
						</Placeholder>
					) : (
						<Message warning>
							<Message.Header>Receiving information failed</Message.Header>
							<p>
								There have been several attempts to fetch information from API. All them
								failed. Check browser console.
							</p>
						</Message>
					)}
				</Tab.Pane>
			),
		});
	});

	return <Tab className="selection-area" panes={panes} />;
}

SelectionArea.propTypes = {
	leagues: MobxPropTypes.observableArrayOf(MobxPropTypes.observableObject),
};

export default observer(SelectionArea);
