import React from 'react';
import { Sidebar } from 'semantic-ui-react';

export default function MobileSidebar(props) {
	return (
		<Sidebar
			className="mobile-sidebar"
			animation="overlay"
			icon="labeled"
			onHide={() => props.onHide()}
			visible={props.sidebarVisible}
			width="wide">
			{props.children}
		</Sidebar>
	);
}
