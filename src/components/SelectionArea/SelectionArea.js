import React from 'react';
import { Tab, Placeholder, Message } from 'semantic-ui-react';
import League from '../LeagueTab/League';
import TeamCheckbox from '../TeamCheckbox/TeamCheckbox';
import './SelectionArea.css';
import LocalErrorBoundary from '../ErrorBoundaries/LocalErrorBoundary';

function SelectionArea(props) {
	let panes = [];

	props.leagues.forEach(league => {
		let teams = [];

		league?.teams?.forEach(team => {
			//league.teams.length > 20 &&
			if (
				league.teams.length <= 20 ||
				league.matches.some(m => m.homeTeam.name === team.name || m.awayTeam.name === team.name)
			) {
				teams.push(
					<TeamCheckbox
						key={team.name}
						team={team}
						onChangeTeam={props.onChangeTeam}></TeamCheckbox>
				);
			}
		});

		panes.push({
			menuItem: {
				key: league?.id,
				content: (
					<LocalErrorBoundary>
						<League
							league={league}
							status="checked"
							onChangeLeague={props.onChangeLeague}></League>
					</LocalErrorBoundary>
				),
			},
			render: () => (
				<Tab.Pane className="tab-content">
					{teams.length > 0 ? (
						teams
					) : league?.status === 'loading' ? (
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

export default SelectionArea;
