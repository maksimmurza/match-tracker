import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

const TeamCheckbox = ({ team }) => {
	return (
		<TeamCheckboxWrapper data-testid="team-checkbox">
			<Checkbox
				onChange={() => team.toggleTeamVisibility()}
				checked={team.show === true}
				disabled={!team.hasMatches}
			/>
			<StyledTeamName active={team.hasMatches}> {team.name}</StyledTeamName>
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
	&&&,
	&&&:hover {
		color: ${props => (props.active ? 'black' : 'lightgray')};
	}
`;

TeamCheckbox.propTypes = {
	team: MobxPropTypes.observableObject,
};

export default observer(TeamCheckbox);
