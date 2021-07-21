import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

const TeamCheckbox = ({ team }) => {
	return (
		<TeamCheckboxWrapper>
			<Checkbox
				data-testid="input"
				onChange={() => team.toggleTeamVisibility()}
				checked={team.show === true}
			/>
			<StyledTeamName> {team.name}</StyledTeamName>
		</TeamCheckboxWrapper>
	);
};

const TeamCheckboxWrapper = styled.div`
	display: flex;
	align-items: center;
	padding: 2px 0;
`;

const StyledTeamName = styled.label`
	padding-left: 5px;
`;

TeamCheckbox.propTypes = {
	team: MobxPropTypes.observableObject,
	onChangeTeam: PropTypes.func,
};

export default observer(TeamCheckbox);
