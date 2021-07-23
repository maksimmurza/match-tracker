import React from 'react';
import { SidebarPushable, SidebarPusher, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MobileSidebar = props => {
	return (
		<SidebarPushable>
			<StyledSidebar
				animation="overlay"
				icon="labeled"
				onHide={props.sidebarToggle}
				visible={props.sidebarVisible}
				width="wide">
				{props.sidebarContent}
			</StyledSidebar>
			<SidebarPusher dimmed={props.sidebarVisible}>{props.children}</SidebarPusher>
		</SidebarPushable>
	);
};

const StyledSidebar = styled(Sidebar)`
	&&&& {
		background-color: gainsboro;
		width: fit-content;
		max-width: 70vw;
	}
`;

MobileSidebar.propTypes = {
	sidebarToggle: PropTypes.func,
	sidebarVisible: PropTypes.bool,
	sidebarContent: PropTypes.node,
};

MobileSidebar.propTypes = {
	children: PropTypes.element.isRequired,
};

export default MobileSidebar;
