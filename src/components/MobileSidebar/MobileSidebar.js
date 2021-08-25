import React, { useState, useEffect } from 'react';
import { SidebarPushable, SidebarPusher, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useCurrentWidth from '../../hooks/useCurrentWidth';

const MobileSidebar = props => {
	const windowWidth = useCurrentWidth();
	const [mobile, setMobile] = useState(false);

	useEffect(() => {
		setMobile(windowWidth <= 768);
	}, [windowWidth]);

	return (
		<>
			{mobile ? (
				<SidebarPushable>
					<StyledSidebar
						data-testid="sidebar"
						animation="overlay"
						icon="labeled"
						onHide={props.sidebarToggle}
						visible={props.sidebarVisible}
						width="wide">
						{props.sidebarContent}
					</StyledSidebar>
					<SidebarPusher dimmed={props.sidebarVisible}>{props.children}</SidebarPusher>
				</SidebarPushable>
			) : (
				props.children
			)}
		</>
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
	children: PropTypes.element.isRequired,
};

export default MobileSidebar;
