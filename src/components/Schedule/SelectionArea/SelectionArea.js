import React from 'react';
import { Tab } from 'semantic-ui-react';
import League from './League/League';
import Team from './Team/Team';
import './SelectionArea.css';
import LocalErrorBoundary from '../../LocalErrorBoundary';

function SelectionArea(props) {
	let panes = [];

	props.leagues.forEach(league => {
		let teams = [];

		league?.teams.forEach(team => {
			//league.teams.length > 20 &&
			if (
				league.teams.length <= 20 ||
				league.matches.some(m => m.homeTeam.name === team.name || m.awayTeam.name === team.name)
			) {
				teams.push(<Team key={team.name} team={team} onChangeTeam={props.onChangeTeam}></Team>);
			}
		});

		panes.push({
			menuItem: {
				key: league?.name,
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
					{teams.length > 0 ? teams : <span>No teams to show</span>}
				</Tab.Pane>
			),
		});
	});

	return <Tab className="wrapper" panes={panes} />;
}

export default SelectionArea;
