import React from 'react';
import { Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function MobileSidebar(props) {
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

MobileSidebar.propTypes = {
	onHide: PropTypes.func,
	sidebarVisible: PropTypes.bool,
	children: PropTypes.object,
};

export default MobileSidebar;
