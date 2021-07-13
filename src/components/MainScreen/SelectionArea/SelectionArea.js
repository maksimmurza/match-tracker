import React from 'react';
import { Tab, Placeholder, Message } from 'semantic-ui-react';
import LeagueTab from '../LeagueTab/League';
import TeamCheckbox from '../TeamCheckbox/TeamCheckbox';
import './SelectionArea.css';
import LocalErrorBoundary from '../../ErrorBoundaries/LocalErrorBoundary';
import PropTypes from 'prop-types';
import League from '../../../model/League';

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
						<LeagueTab
							league={league}
							status="checked"
							onChangeLeague={props.onChangeLeague}></LeagueTab>
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

SelectionArea.propTypes = {
	leagues: PropTypes.arrayOf(PropTypes.instanceOf(League)),
	onChangeLeague: PropTypes.func,
	onChangeTeam: PropTypes.func,
};

export default SelectionArea;
