import React from 'react';
import { Sidebar, Container } from 'semantic-ui-react';

export default function MobileSidebar(props) {
	return (
		<Sidebar
			className="mobile-sidebar"
			as={Container}
			animation="overlay"
			icon="labeled"
			onHide={() => props.onHide()}
			visible={props.sidebarVisible}
			width="wide">
			{props.children}
		</Sidebar>
	);
}
