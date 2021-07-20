import React from 'react';
import { Tab, Placeholder, Message } from 'semantic-ui-react';
import LeagueTab from '../LeagueTab/LeagueTab';
import TeamCheckbox from '../TeamCheckbox/TeamCheckbox';
import './SelectionArea.css';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

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
		let teamsList = league?.teams?.map(team => {
			if (
				league.teams.length <= 20 ||
				league.matches.some(m => m.homeTeam === team || m.awayTeam === team)
			) {
				return <TeamCheckbox key={team.id} team={team} />;
			}
		});

		tabs.push({
			menuItem: {
				key: league?.id,
				content: <LeagueTab league={league}></LeagueTab>,
			},
			render: () => (
				<Tab.Pane className="tab-content">
					{teamsList.length > 0 ? teamsList : league?.loading ? teamsPlaceholder : failureMessage}
				</Tab.Pane>
			),
		});
	});

	return <Tab className="selection-area" panes={tabs} />;
}

SelectionArea.propTypes = {
	leagues: MobxPropTypes.observableArrayOf(MobxPropTypes.observableObject),
};

export default observer(SelectionArea);
