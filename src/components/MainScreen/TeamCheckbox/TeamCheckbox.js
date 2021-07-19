import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import './TeamCheckbox.css';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

class TeamCheckbox extends React.Component {
	handleChange = () => {
		this.props.toggleTeamVisibility(this.props.team.name);
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

export default observer(TeamCheckbox);
