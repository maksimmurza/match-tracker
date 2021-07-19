import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import './TeamCheckbox.css';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

const TeamCheckbox = ({ toggleTeamVisibility, writeLocal, team }) => {
	const handleChange = () => {
		toggleTeamVisibility(team.name);
		writeLocal();
	};

	return (
		<div className="team-tab-content">
			<Checkbox data-testid="input" onChange={handleChange} checked={team.show === true} />
			<label className="team-name-tab-content"> {team.name}</label>
		</div>
	);
};

TeamCheckbox.propTypes = {
	team: MobxPropTypes.observableObject,
	onChangeTeam: PropTypes.func,
};

export default observer(TeamCheckbox);
