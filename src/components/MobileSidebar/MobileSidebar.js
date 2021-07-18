import React from 'react';
import { SidebarPushable, SidebarPusher, Sidebar } from 'semantic-ui-react';
import './MobileSidebar.css';

const MobileSidebar = props => {
	return (
		<SidebarPushable>
			<Sidebar
				className="mobile-sidebar"
				animation="overlay"
				icon="labeled"
				onHide={props.sidebarToggle}
				visible={props.sidebarVisible}
				width="wide">
				{props.sidebarContent}
			</Sidebar>
			<SidebarPusher dimmed={props.sidebarVisible}>{props.children}</SidebarPusher>
		</SidebarPushable>
	);
};

export default MobileSidebar;
