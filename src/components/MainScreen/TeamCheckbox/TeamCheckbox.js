import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import './TeamCheckbox.css';
import PropTypes from 'prop-types';

class TeamCheckbox extends React.Component {
	handleChange = () => {
		const changedTeamName = this.props.team.name;
		const changedLeagueName = this.props.team.leagueName;
		const newTeamStatus = this.props.team.show ? 'unchecked' : 'checked';
		this.props.onChangeTeam(changedTeamName, changedLeagueName, newTeamStatus);
	};

	render() {
		return (
			<div className="team-tab-content">
				<Checkbox
					data-testid="input"
					onChange={this.handleChange}
					checked={this.props.team.show === true}
				/>
				<label className="team-name-tab-content"> {this.props.team.name}</label>
			</div>
		);
	}
}

TeamCheckbox.propTypes = {
	team: PropTypes.object,
	onChangeTeam: PropTypes.func,
};

export default TeamCheckbox;
